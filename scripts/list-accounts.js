import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const accountSchema = new mongoose.Schema({
    accountNumber: String,
    balance: Number,
    currency: String
}, { strict: false });

const Account = mongoose.model('PinnacleAccount', accountSchema);

async function listAccounts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const accounts = await Account.find({ accountNumber: { $ne: '4233713375' } }).limit(5);

        if (accounts.length > 0) {
            console.log('Available Accounts (excluding 4233713375):');
            accounts.forEach(acc => {
                console.log(`- Account Number: ${acc.accountNumber}, Balance: ${acc.balance} ${acc.currency}`);
            });
        } else {
            console.log('No other accounts found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

listAccounts();
