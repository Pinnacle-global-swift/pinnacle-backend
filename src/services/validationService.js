import { ValidationError } from '../utils/errors.js';
import { Account } from '../models/Account.js';
import { User } from '../models/User.js';

export const validationService = {
  async validateBalance(userId, amount) {
    const account = await Account.findOne({ userId });
    if (!account || account.balance < amount) {
      throw new ValidationError('Insufficient balance', 400);
    }
    return account;
  },

  async validateKYC(userId) {
    const user = await User.findById(userId);
    if (!user || !user.kycVerified) {
      throw new ValidationError('KYC verification required for withdrawals', 403);
    }
    return user;
  },

  async validateCard(userId) {
    const user = await User.findById(userId);
    if (!user || !user.hasActiveCard) {
      throw new ValidationError('Active card required for withdrawals', 403);
    }
    return user;
  }
};