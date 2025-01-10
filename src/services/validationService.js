import { Account } from '../models/Account.js';
import { Card } from '../models/Card.js';
import { KYC } from '../models/KYC.js';
import { KYC_STATUS } from '../constants/status.js';
import { ValidationError } from '../utils/errors.js';

export const validationService = {
  async validateBalance(userId, amount) {
    const account = await Account.findOne({ userId });
    if (!account || account.balance < amount) {
      throw new ValidationError('Insufficient balance');
    }
    return account;
  },

  async validateKYC(userId) {
    const kyc = await KYC.findOne({ userId });
    if (!kyc || kyc.status !== KYC_STATUS.APPROVED) {
      throw new ValidationError('KYC verification required for withdrawals', 403);
    }
    return kyc;
  },

  async validateCard(userId) {
    const card = await Card.findOne({ userId });
    if (!card || card.status !== 'active') {
      throw new ValidationError('Active card required for withdrawals', 403);
    }
    return card;
  }
};