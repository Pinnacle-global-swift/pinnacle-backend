import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true,
    unique: true
  },
  language: {
    type: String,
    enum: ['English', 'Spanish', 'French', 'German', 'Italian'],
    default: 'English'
  },
  transactionLimits: {
    dailyTransfer: {
      type: Number,
      default: 2500,
      max: 5000
    },
    dailyWithdrawal: {
      type: Number,
      default: 1000,
      max: 2000
    },
    cardSpending: {
      type: Number,
      default: 3000,
      max: 10000
    }
  }
}, {
  timestamps: true
});

export const UserSettings = mongoose.model('PinnacleUserSettings', userSettingsSchema);