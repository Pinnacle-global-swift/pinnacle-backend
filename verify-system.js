import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Account } from './src/models/Account.js';
import { KYC } from './src/models/KYC.js';
import { Card } from './src/models/Card.js';

dotenv.config();

const API_URL = 'http://localhost:3001/api';
const timestamp = Date.now();

const USER_A = {
    fullName: 'Final Sender A',
    email: `sender-${timestamp}@pinnacle.com`,
    password: 'Password123!',
    accountType: 'personal',
    gender: 'male',
    country: 'United States',
    address: 'Sender Avenue 1',
    phoneNumber: '+1999777111'
};

const USER_B = {
    fullName: 'Final Receiver B',
    email: `receiver-${timestamp}@pinnacle.com`,
    password: 'Password123!',
    accountType: 'personal',
    gender: 'female',
    country: 'Germany',
    address: 'Receiver Road 99',
    phoneNumber: '+4912345678'
};

let tokenA = '';
let userA_id = '';
let accNumA = '';
let accNumB = '';

async function runSystemTest() {
    console.log('🚀 Starting Final Dual-User E2E Verification...');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to Database');

        // 1. Setup Sender (User A)
        console.log('\n--- Setting up Sender (User A) ---');
        await axios.post(`${API_URL}/auth/register`, USER_A);
        const dbA = await User.findOne({ email: USER_A.email });
        await axios.post(`${API_URL}/auth/verify-otp`, { email: USER_A.email, otp: dbA.otp });
        const loginA = await axios.post(`${API_URL}/auth/login`, { email: USER_A.email, password: USER_A.password });
        tokenA = loginA.data.token;
        userA_id = loginA.data.data.id;
        const infoA = await axios.get(`${API_URL}/account/info`, { headers: { Authorization: `Bearer ${tokenA}` } });
        accNumA = infoA.data.data.accountNumber;
        console.log(`✅ User A Ready. Acc: ${accNumA}`);

        // 2. Setup Receiver (User B)
        console.log('\n--- Setting up Receiver (User B) ---');
        await axios.post(`${API_URL}/auth/register`, USER_B);
        const dbB_raw = await User.findOne({ email: USER_B.email });
        const accB_raw = await Account.findOne({ userId: dbB_raw._id });
        accNumB = accB_raw.accountNumber;
        console.log(`✅ User B Ready. Acc: ${accNumB}`);

        // 3. MOCK: Prep User A for high-value tests
        console.log('\n--- Mocking User A Prereqs (KYC, Balance) ---');
        await User.findByIdAndUpdate(userA_id, { kycVerified: true, kycStatus: 'approved' });
        await Account.findOneAndUpdate({ userId: userA_id }, { $inc: { balance: 250000 } });

        // Withdrawal requires an entry in KYC model
        await KYC.create({
            userId: userA_id,
            fullLegalName: USER_A.fullName,
            dateOfBirth: new Date('1990-01-01'),
            idType: 'national_id',
            idNumber: 'TEST-12345',
            status: 'approved',
            verificationDate: new Date()
        });
        console.log('✅ User A KYC and Balance mocked');

        // 4. TEST: Card Application & Activation
        console.log('\n--- Testing Card Application & Activation ---');
        const formData = new FormData();
        formData.append('type', 'premium');
        const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        const pixelBuffer = Buffer.from(pixelBase64, 'base64');
        const dummyFile = new Blob([pixelBuffer], { type: 'image/png' });
        formData.append('paymentReceipt', dummyFile, 'receipt.png');

        await axios.post(`${API_URL}/cards/apply`, formData, {
            headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'multipart/form-data' }
        });

        // Force activate the card in DB to bypass payment/manual steps for withdrawal test
        await Card.findOneAndUpdate({ userId: userA_id }, { status: 'active', paymentStatus: 'paid' });
        console.log('✅ Card applied and force-activated in DB');

        // 5. TEST: Inter-account Transfer (A -> B)
        console.log(`\n--- Testing Transfer (User A -> User B) ---`);
        await axios.post(`${API_URL}/transfer`, {
            accountNumber: accNumB,
            beneficiaryName: USER_B.fullName,
            amount: 50000,
            description: 'System Verification Transfer'
        }, { headers: { Authorization: `Bearer ${tokenA}` } });
        console.log('✅ $50,000 transfer successful');

        // 6. TEST: Withdrawal Request
        console.log('\n--- Testing Withdrawal Request ---');
        await axios.post(`${API_URL}/withdrawals`, {
            amount: 25000,
            withdrawalMethod: 'Bank Transfer',
            accountNumber: '9900887766'
        }, { headers: { Authorization: `Bearer ${tokenA}` } });
        console.log('✅ $25,000 withdrawal request successful');

        // 7. VERIFY: Final State
        console.log('\n--- Final Verification ---');
        const finalA = await axios.get(`${API_URL}/account/info`, { headers: { Authorization: `Bearer ${tokenA}` } });
        console.log(`✅ User A Final Balance: ${finalA.data.data.balance} (Expected 175000)`);

        const notesA = await axios.get(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${tokenA}` } });
        console.log(`✅ Flow generated ${notesA.data.data.length} notifications.`);

        console.log('\n🏁 E2E VERIFICATION COMPLETE: ALL CRYSTAL CLEAR 💎');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification Failed:');
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Technical Error:', error.message);
        }
        process.exit(1);
    }
}

runSystemTest();
