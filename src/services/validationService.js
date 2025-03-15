import { ValidationError } from '../utils/errors.js';
import { Account } from '../models/Account.js';
import { User } from '../models/User.js';
import { KYC } from '../models/KYC.js';
import { Card } from '../models/Card.js';

export const validationService = {
  async validateBalance(userId, amount) {
    const account = await Account.findOne({ userId });
    if (!account || account.balance < amount) {
      throw new ValidationError('Insufficient balance', 400);
    }
    return account;
  },

  async validateKYC(userId) {
    const [user, kyc] = await Promise.all([
      User.findById(userId),
      KYC.findOne({ userId }).sort({ createdAt: -1 })
    ]);

    if (!user) {
      throw new ValidationError('User not found', 404);
    }

    if (!kyc || kyc.status !== 'approved') {
      throw new ValidationError('KYC verification required for withdrawals', 403);
    }

    return user;
  },

  async validateCard(userId) {
    const card = await Card.findOne({ userId });

    if (!card) {
      throw new ValidationError('Please apply for a card before withdrawing', 403);
    }

    if (card.status !== 'active') {
      switch (card.status) {
        case 'pending':
          throw new ValidationError('Your card application is pending approval', 403);
        case 'rejected':
          throw new ValidationError('Your card application was rejected. Please apply again', 403);
        default:
          throw new ValidationError('Please activate your card before withdrawing', 403);
      }
    }

    return card;
  }
};