import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PinnacleUser',
        required: true,
        unique: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Account = mongoose.model('PinnacleAccount', accountSchema);

async function checkBalance(accountNumber) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const account = await Account.findOne({ accountNumber });

        if (account) {
            console.log(`Account Number: ${accountNumber}`);
            console.log(`Balance: ${account.balance} ${account.currency}`);
            console.log(`Status: ${account.status}`);
        } else {
            console.log(`Account with number ${accountNumber} not found.`);
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

const accountNumber = process.argv[2] || '4233713375';
checkBalance(accountNumber);
