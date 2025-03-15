import { Transaction } from '../models/Transaction.js';
import { Account } from '../models/Account.js';
import { User } from '../models/User.js';
import { Card } from '../models/Card.js';
import { KYC } from '../models/KYC.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';
import { validationService } from './validationService.js';
import { generateReference } from '../utils/transactionUtils.js';
import { TransactionError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const withdrawalService = {
  async checkPrerequisites(userId) {
    // Get user, KYC, and Card status in parallel
    const [user, kyc, card] = await Promise.all([
      User.findById(userId),
      KYC.findOne({ userId, status: 'approved' }),
      Card.findOne({ userId })
    ]);

    if (!user) {
      throw new ValidationError('User not found', 404);
    }

    // Check KYC first
    if (!kyc) {
      throw new ValidationError('KYC verification required for withdrawals', 403);
    }

    // Check if card exists
    if (!card) {
      throw new ValidationError('Please apply for a card before withdrawing', 403);
    }

    // Check card status
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

    return true;
  },

  async validateWithdrawal(userId, amount) {
    // Check all requirements in sequence
    const account = await validationService.validateBalance(userId, amount);
    await validationService.validateKYC(userId);
    await validationService.validateCard(userId);
    return account;
  },

  async processWithdrawal(userId, { amount, withdrawalMethod, accountNumber, swiftCode }) {
    // First check prerequisites
    await this.checkPrerequisites(userId);

    const session = await Account.startSession();
    session.startTransaction();

    try {
      const account = await this.validateWithdrawal(userId, amount);

      const reference = generateReference();
      const transaction = await Transaction.create([{
        userId,
        type: TRANSACTION_TYPE.WITHDRAWAL,
        amount,
        reference,
        description: `${withdrawalMethod} withdrawal to ${accountNumber}`,
        balanceAfter: account.balance - amount,
        status: TRANSACTION_STATUS.PROCESSING,
        metadata: {
          withdrawalMethod,
          accountNumber,
          ...(swiftCode && { swiftCode })
        }
      }], { session });

      // Update account balance
      account.balance -= amount;
      await account.save({ session });

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      logger.error('Withdrawal processing error:', error);

      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new TransactionError('Unable to process withdrawal at this time');
    } finally {
      session.endSession();
    }
  }
};