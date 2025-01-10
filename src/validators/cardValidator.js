import { KYC } from '../models/KYC.js';
import { Account } from '../models/Account.js';
import { ValidationError } from '../utils/errors.js';
import { KYC_STATUS } from '../constants/status.js';
import { CARD_REQUIREMENTS } from '../constants/cardConstants.js';
import { isWorkingDaysValid } from '../utils/dateUtils.js';

export const cardValidator = {
  async validateKYC(userId) {
    const kyc = await KYC.findOne({ userId });
    if (!kyc || kyc.status !== KYC_STATUS.APPROVED) {
      throw new ValidationError('KYC verification must be completed and approved');
    }
  },

  async validateAccountBalance(userId) {
    const account = await Account.findOne({ userId });
    if (!account || account.balance < CARD_REQUIREMENTS.MINIMUM_BALANCE) {
      throw new ValidationError(`Minimum balance of $${CARD_REQUIREMENTS.MINIMUM_BALANCE} required`);
    }
    return account;
  },

  async validateAccountAge(account) {
    const isValid = await isWorkingDaysValid(
      account.createdAt, 
      CARD_REQUIREMENTS.MINIMUM_WORKING_DAYS
    );
    
    if (!isValid) {
      throw new ValidationError(
        `Account must be active for at least ${CARD_REQUIREMENTS.MINIMUM_WORKING_DAYS} working days`
      );
    }
  },

  async validateAll(userId) {
    await this.validateKYC(userId);
    const account = await this.validateAccountBalance(userId);
    await this.validateAccountAge(account);
  }
};