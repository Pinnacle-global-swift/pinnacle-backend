import axios from 'axios';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import mongoose from 'mongoose';

dotenv.config();

const API_URL = 'http://localhost:3001/api';
const timestamp = Date.now();
const testEmail = `admin-test-${timestamp}@pinnacle.com`;
const testPassword = 'Password123!';

async function testAdminEmail() {
    console.log('🚀 Debugging Admin Email (Detailed Logs)...');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to Database');

        // 1. Create a fresh verified user
        console.log(`👤 Creating test user: ${testEmail}`);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                fullName: 'Admin Test User',
                email: testEmail,
                password: testPassword,
                accountType: 'personal',
                gender: 'male',
                country: 'USA',
                address: '123 Admin Lane',
                phoneNumber: `+1555${Math.floor(Math.random() * 899999) + 100000}`
            });
        } catch (regErr) {
            console.error('❌ Registration Failed:');
            if (regErr.response) {
                console.error('Status:', regErr.response.status);
                console.error('Data:', JSON.stringify(regErr.response.data, null, 2));
            } else {
                console.error('Error:', regErr.message);
            }
            process.exit(1);
        }

        const user = await User.findOne({ email: testEmail });
        if (!user) {
            console.error('❌ User not found in DB after registration!');
            process.exit(1);
        }

        // Verify OTP manually
        await User.findByIdAndUpdate(user._id, { isVerified: true, role: 'admin' });
        console.log('✅ User created, verified, and promoted to admin');

        // 2. Login
        console.log('🔑 Attempting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: testPassword
        });

        const adminToken = loginRes.data.token;
        console.log('🔓 Logged in as Admin');

        // 3. Test Send Email to self
        console.log('\n--- Sending Professional Admin Email ---');
        const emailPayload = {
            userId: user._id,
            subject: 'System Maintenance Alert',
            title: 'Scheduled System Maintenance',
            message: 'Dear User, <br><br> We will be performing scheduled maintenance on <strong>Sunday, Jan 10th</strong> at 02:00 UTC. <br> Expected downtime is 30 minutes.'
        };

        const res = await axios.post(`${API_URL}/admin/email/send`, emailPayload, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        console.log('✅ Response:', res.data.message);

        console.log('\n🏁 Admin Email Verification Complete! 📧');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Unexpected Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
        process.exit(1);
    }
}

testAdminEmail();
