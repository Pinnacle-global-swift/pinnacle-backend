import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  }
}, {
  timestamps: true
});

export const TokenBlacklist = mongoose.model('PinnacleTokenBlacklist', tokenBlacklistSchema);