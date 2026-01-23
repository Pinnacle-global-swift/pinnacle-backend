import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Account } from '../src/models/Account.js';
import { User } from '../src/models/User.js';
import { generateAccountNumber } from '../src/utils/accountUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function createValidAccount() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a dummy user
        const user = new User({
            fullName: 'Test User Admin Fund',
            email: `test_admin_fund_${Date.now()}@example.com`,
            password: 'password123',
            role: 'user'
        });
        await user.save();
        console.log(`Created test user: ${user.fullName}`);

        const accountNumber = generateAccountNumber();
        const account = new Account({
            userId: user._id,
            accountNumber: accountNumber,
            balance: 0,
            currency: 'USD',
            status: 'active'
        });
        await account.save();
        console.log(`Created valid account: ${accountNumber}`);

        await mongoose.disconnect();
        return accountNumber;
    } catch (error) {
        console.error('Error:', error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

createValidAccount();
