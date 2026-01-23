import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminTransferService } from '../src/services/adminTransferService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function runAdminFund(accountNumber, amount, description, senderName) {
    try {
        console.log(`Attempting to fund account ${accountNumber} with ${amount} USD...`);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await adminTransferService.transferByAccountNumber(
            accountNumber,
            amount,
            description,
            senderName
        );

        console.log('--- Transfer Successful ---');
        console.log(`Recipient: ${result.recipientName}`);
        console.log(`Amount: ${result.amount} USD`);
        console.log(`New Balance: ${result.newBalance} USD`);
        console.log(`Transaction ID: ${result.transactionId}`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('--- Transfer Failed ---');
        console.error('Error:', error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

const accountNumber = process.argv[2] || '4230025640';
const amount = parseFloat(process.argv[3]) || 1000;
const description = process.argv[4] || 'Admin Test Funding';
const senderName = process.argv[5] || 'Admin Tester';

runAdminFund(accountNumber, amount, description, senderName);
