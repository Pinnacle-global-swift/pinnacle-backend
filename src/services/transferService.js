import { Account } from '../models/Account.js';
import { Transaction } from '../models/Transaction.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';
import { generateReference } from '../utils/transactionUtils.js';
import { logger } from '../utils/logger.js';
import { transferValidator } from '../validators/transferValidator.js';
// import { notificationService } from './notificationService.js';

class TransferService {
  async processTransfer(userId, { accountNumber, beneficiaryName, amount, description }) {
    const session = await Account.startSession();
    session.startTransaction();

    try {
      const { senderAccount, recipientAccount } = await transferValidator.validateTransfer(
        userId, 
        accountNumber, 
        amount
      );

      const transaction = await this.createTransactionRecord(
        userId,
        senderAccount,
        accountNumber,
        beneficiaryName,
        amount,
        description,
        session
      );

      await this.updateAccountBalances(
        senderAccount,
        recipientAccount,
        amount,
        session
      );

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      logger.error('Transfer processing error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createTransactionRecord(userId, senderAccount, accountNumber, beneficiaryName, amount, description, session) {
    return (await Transaction.create([{
      userId,
      type: TRANSACTION_TYPE.TRANSFER,
      amount,
      reference: generateReference(),
      description,
      balanceAfter: senderAccount.balance - amount,
      status: TRANSACTION_STATUS.COMPLETED,
      metadata: {
        recipientAccount: accountNumber,
        beneficiaryName
      }
    }], { session }))[0];
  }

  async updateAccountBalances(senderAccount, recipientAccount, amount, session) {
    senderAccount.balance -= amount;
    recipientAccount.balance += amount;

    await Promise.all([
      senderAccount.save({ session }),
      recipientAccount.save({ session })
    ]);
  }
}

export const transferService = new TransferService();