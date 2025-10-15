import { Account } from '../models/Account.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { logger } from '../utils/logger.js';
import { notificationService } from './notificationService.js';
import { ValidationError } from '../utils/errors.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';
import { generateReference } from '../utils/transactionUtils.js';
import { isValidAccountNumber } from '../utils/accountUtils.js';

class AdminTransferService {
  async transferByAccountNumber(accountNumber, amount, description, senderName, idempotencyKey) {
    // Basic validations
    if (!isValidAccountNumber(accountNumber)) {
      throw new ValidationError('Invalid account number format');
    }
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      throw new ValidationError('Amount must be a positive number');
    }
    if (!senderName || typeof senderName !== 'string' || senderName.trim().length < 2) {
      throw new ValidationError('Sender name is required');
    }

    const session = await Account.startSession();
    session.startTransaction();

    try {
      const recipientAccount = await Account.findOne({ accountNumber }).session(session);
      if (!recipientAccount) {
        throw new ValidationError('Account not found');
      }
      if (recipientAccount.status !== 'active') {
        throw new ValidationError('Account is not active');
      }

      const recipientUser = await User.findById(recipientAccount.userId).session(session);
      if (!recipientUser) {
        throw new ValidationError('User not found');
      }

      // Idempotency: return existing transaction if the same idempotencyKey was used
      if (idempotencyKey) {
        const existing = await Transaction.findOne({
          userId: recipientUser._id,
          'metadata.transferType': 'admin_transfer',
          'metadata.idempotencyKey': idempotencyKey
        }).session(session);
        if (existing) {
          // No changes; assume previous run succeeded
          await session.commitTransaction();
          return {
            recipientName: recipientUser.fullName,
            senderName,
            accountNumber,
            amount: existing.amount,
            newBalance: recipientAccount.balance,
            transactionId: existing._id
          };
        }
      }

      // Create transaction record first
      const [transaction] = await Transaction.create([
        {
          userId: recipientUser._id,
          type: TRANSACTION_TYPE.DEPOSIT,
          amount,
          status: TRANSACTION_STATUS.COMPLETED,
          reference: generateReference(),
          description: description || `Transfer from ${senderName}`,
          balanceAfter: recipientAccount.balance + amount,
          metadata: {
            transferType: 'admin_transfer',
            initiatedBy: 'admin',
            senderName,
            accountNumber,
            ...(idempotencyKey ? { idempotencyKey } : {})
          }
        }
      ], { session });

      // Update balance
      recipientAccount.balance += amount;
      await recipientAccount.save({ session });

      // Commit funds changes first to ensure atomicity
      await session.commitTransaction();

      // Post-commit side effects (do not block the main result)
      try {
        await Promise.all([
          notificationService.createNotification({
            userId: recipientUser._id,
            title: 'Transfer Received',
            message: `${amount} USD has been credited to your account from ${senderName}. ${description || ''}`,
            type: 'success'
          }),
          notificationService.sendTransactionAlert(recipientUser, {
            amount,
            type: 'Credit',
            balance: recipientAccount.balance,
            senderName
          })
        ]);
      } catch (notifyErr) {
        logger.error('Post-commit notification error:', notifyErr);
      }

      return {
        recipientName: recipientUser.fullName,
        senderName,
        accountNumber,
        amount,
        newBalance: recipientAccount.balance,
        transactionId: transaction._id
      };
    } catch (error) {
      await session.abortTransaction();
      logger.error('Admin transfer failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const adminTransferService = new AdminTransferService();
