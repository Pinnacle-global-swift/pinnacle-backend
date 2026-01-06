import axios from 'axios';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import mongoose from 'mongoose';

dotenv.config();

const API_URL = 'http://localhost:3001/api';
const TARGET_EMAIL = 'templevoke@gmail.com';
const PASS = 'Password123!';

async function sendUserTestEmail() {
    console.log(`🚀 Preparing Live Test for ${TARGET_EMAIL}...`);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to Database');

        // 1. Register/Verify recipient
        let user = await User.findOne({ email: TARGET_EMAIL });
        if (!user) {
            console.log(`👤 Registering ${TARGET_EMAIL}...`);
            await axios.post(`${API_URL}/auth/register`, {
                fullName: 'Temple User',
                email: TARGET_EMAIL,
                password: PASS,
                accountType: 'personal',
                gender: 'male',
                country: 'Nigeria',
                address: '123 Pinnacle Way',
                phoneNumber: '+2348000000001'
            });
            user = await User.findOne({ email: TARGET_EMAIL });
        }

        // Force verify and make admin for this test
        await User.findByIdAndUpdate(user._id, { isVerified: true, role: 'admin' });
        console.log('✅ User ready (Verified & Admin role granted)');

        // 2. Login as Admin
        console.log('🔑 Logging in to get token...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TARGET_EMAIL,
            password: PASS
        });

        const token = loginRes.data.token;

        // 3. Send Admin Email
        console.log('\n--- Sending Professional Admin Email ---');
        const emailPayload = {
            userId: user._id,
            subject: 'System Upgrade Notification',
            title: 'Pinnacle Swift System Upgrade',
            message: `
        Hello ${user.fullName}, <br><br>
        We are pleased to inform you that your account has been migrated to our new <strong>high-frequency trading core</strong>. <br><br>
        This upgrade provides: <br>
        • 50% faster transaction processing <br>
        • Enhanced real-time fraud monitoring <br>
        • Premium support access <br><br>
        Thank you for choosing Pinnacle Global Swift.
      `
        };

        const res = await axios.post(`${API_URL}/admin/email/send`, emailPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Success:', res.data.message);
        console.log('\n🏁 Live Test Complete! Please check templevoke@gmail.com or Mailtrap. 📧');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Live Test Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

sendUserTestEmail();
