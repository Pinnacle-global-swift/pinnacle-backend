import mongoose from 'mongoose';
import { CARD_STATUS } from '../constants/status.js';

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['virtual', 'physical', 'premium', 'mastercard'] // adjust based on your card types
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  maskedCardNumber: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true,
    select: false
  },
  pinHash: {
    type: String,
    select: false
  },
  expiryMonth: {
    type: String,
    required: true
  },
  expiryYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(CARD_STATUS),
    default: CARD_STATUS.PENDING,
    set: (value) => value.toLowerCase()
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentMethod: String,
  transactionId: String,
  paymentDate: Date,
  remarks: String,
  limit: {
    type: Number,
    required: true
  },
  activationDate: Date,
  rejectionReason: {
    type: String
  },
  reappliedAt: {
    type: Date
  },
  paymentReceipt: {
    type: String, // This will store the S3 URL of the receipt image
  }
}, {
  timestamps: true
});

// Middleware to format card number before saving
cardSchema.pre('save', function (next) {
  if (this.isModified('cardNumber')) {
    this.maskedCardNumber = `****-****-****-${this.cardNumber.slice(-4)}`;
  }
  next();
});

export const Card = mongoose.model('Card', cardSchema);