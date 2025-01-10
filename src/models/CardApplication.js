import mongoose from 'mongoose';

const cardApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['processing', 'approved', 'rejected'],
    default: 'processing'
  },
  cardType: {
    type: String,
    enum: ['virtual_debit', 'premium_credit'],
    required: true
  }
}, {
  timestamps: true
});

export const CardApplication = mongoose.model('PinnacleCardApplication', cardApplicationSchema);