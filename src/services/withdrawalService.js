import { Transaction } from '../models/Transaction.js';
import { Account } from '../models/Account.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';
import { validationService } from './validationService.js';
import { generateReference } from '../utils/transactionUtils.js';
import { TransactionError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const withdrawalService = {
  async validateWithdrawal(userId, amount) {
    // Check all requirements in sequence
    const account = await validationService.validateBalance(userId, amount);
    await validationService.validateKYC(userId);
    await validationService.validateCard(userId);
    return account;
  },

  async processWithdrawal(userId, { amount, withdrawalMethod, accountNumber, swiftCode }) {
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