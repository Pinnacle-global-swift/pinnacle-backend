import { Account } from '../models/Account.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { logger } from '../utils/logger.js';
import { notificationService } from './notificationService.js';
import { ValidationError } from '../utils/errors.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';
import { generateReference } from '../utils/transactionUtils.js';


class AdminTransferService {
  async processAdminTransfer(userId, amount, description) {
    const session = await Account.startSession();
    session.startTransaction();

    try {
      const { userAccount, user } = await this.validateAndGetUser(userId);
      await this.updateBalance(userAccount, amount, session);
      await this.createNotifications(user, amount, description, session);

      await session.commitTransaction();
      return userAccount;
    } catch (error) {
      await session.abortTransaction();
      logger.error('Admin transfer failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async validateAndGetUser(userId) {
    const [userAccount, user] = await Promise.all([
      Account.findOne({ userId }),
      User.findById(userId)
    ]);

    if (!userAccount || !user) {
      throw new Error('User account not found');
    }

    return { userAccount, user };
  }

  async updateBalance(account, amount, session) {
    account.balance += amount;
    await account.save({ session });
  }

  async createNotifications(user, amount, description, session) {
    await Promise.all([
      notificationService.createUserNotification({
        userId: user._id,
        title: 'Admin Transfer Received',
        message: `${amount} USD has been credited to your account. ${description || ''}`,
        type: 'success'
      }, session),
      notificationService.createAdminNotification({
        userId: user._id,
        title: 'Admin Transfer Completed',
        message: `Successfully transferred ${amount} USD to ${user.fullName}`,
        type: 'info'
      }, session)
    ]);
  }

  // async transferByAccountNumber(accountNumber, amount, description) {
  //   const session = await Account.startSession();
  //   session.startTransaction();

  //   try {
  //     // Find recipient account and user
  //     const recipientAccount = await Account.findOne({ accountNumber });
  //     if (!recipientAccount) {
  //       throw new ValidationError('Account not found');
  //     }

  //     const recipientUser = await User.findById(recipientAccount.userId);
  //     if (!recipientUser) {
  //       throw new ValidationError('User not found');
  //     }

  //     // Update recipient balance
  //     recipientAccount.balance += amount;
  //     await recipientAccount.save({ session });

  //     // Create notifications
  //     await Promise.all([
  //       notificationService.createNotification({
  //         userId: recipientUser._id,
  //         title: 'Admin Transfer Received',
  //         message: `${amount} USD has been credited to your account. ${description || ''}`,
  //         type: 'success'
  //       }, session),
        
  //       // Send email notification
  //       notificationService.sendTransactionAlert(recipientUser, {
  //         amount,
  //         type: 'Credit',
  //         balance: recipientAccount.balance
  //       })
  //     ]);

  //     await session.commitTransaction();

  //     return {
  //       recipientName: recipientUser.fullName,
  //       accountNumber,
  //       amount,
  //       newBalance: recipientAccount.balance
  //     };
  //   } catch (error) {
  //     await session.abortTransaction();
  //     logger.error('Admin transfer failed:', error);
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  async transferByAccountNumber(accountNumber, amount, description) {
    const session = await Account.startSession();
    session.startTransaction();

    try {
      // Find recipient account and user
      const recipientAccount = await Account.findOne({ accountNumber });
      if (!recipientAccount) {
        throw new ValidationError('Account not found');
      }

      const recipientUser = await User.findById(recipientAccount.userId);
      if (!recipientUser) {
        throw new ValidationError('User not found');
      }

      // Create transaction record
      const transaction = await Transaction.create([{
        userId: recipientUser._id,
        type: TRANSACTION_TYPE.DEPOSIT,
        amount,
        status: TRANSACTION_STATUS.COMPLETED,
        reference: generateReference(),
        description: description || 'Admin Transfer',
        balanceAfter: recipientAccount.balance + amount,
        metadata: {
          transferType: 'admin_transfer',
          initiatedBy: 'admin'
        }
      }], { session });

      // Update recipient balance
      recipientAccount.balance += amount;
      await recipientAccount.save({ session });

      // Create notifications
      await Promise.all([
        notificationService.createNotification({
          userId: recipientUser._id,
          title: 'Admin Transfer Received',
          message: `${amount} USD has been credited to your account. ${description || ''}`,
          type: 'success'
        }, session),
        
        // Send email notification
        notificationService.sendTransactionAlert(recipientUser, {
          amount,
          type: 'Credit',
          balance: recipientAccount.balance
        })
      ]);

      await session.commitTransaction();

      return {
        recipientName: recipientUser.fullName,
        accountNumber,
        amount,
        newBalance: recipientAccount.balance,
        transactionId: transaction[0]._id
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