import mongoose from 'mongoose';
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../constants/status.js';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPE),
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: Object.values(TRANSACTION_STATUS),
    default: TRANSACTION_STATUS.PROCESSING
  },
  reference: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  balanceAfter: Number,
  metadata: {
    withdrawalMethod: String,
    accountNumber: String,
    swiftCode: String
  }
}, {
  timestamps: true
});

export const Transaction = mongoose.model('PinnacleTransaction', transactionSchema);