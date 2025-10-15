import { User } from '../models/User.js';
import { Account } from '../models/Account.js';
import { Card } from '../models/Card.js';
import { Notification } from '../models/Notification.js';
import { transferService } from '../services/transferService.js';
import {adminTransferService } from '../services/adminTransferService.js'
import { Transaction } from '../models/Transaction.js';
import { KYC } from '../models/KYC.js';

export const adminController = {

  adminTransfer: async (req, res, next) => {
    try {
      const { userId, amount, description } = req.body;

      if (!userId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'User ID and amount are required'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const updatedAccount = await transferService.adminTransfer(userId, amount, description);

      res.status(200).json({
        success: true,
        data: {
          message: 'Transfer successful',
          newBalance: updatedAccount.balance
        }
      });
    } catch (error) {
      next(error);
    }
  },

  adminTransferByAccount: async (req, res, next) => {
    try {
      const { accountNumber, amount, description, senderName, idempotencyKey } = req.body;

      if (!accountNumber || !amount || !senderName) {
        return res.status(400).json({
          success: false,
          error: 'Account number, amount, and sender name are required'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      const result = await adminTransferService.transferByAccountNumber(
        accountNumber,
        amount,
        description,
        senderName,
        idempotencyKey
      );

      res.status(200).json({
        success: true,
        data: {
          message: 'Transfer successful',
          recipientName: result.recipientName,
          senderName: result.senderName,
          accountNumber: result.accountNumber,
          amount: result.amount,
          newBalance: result.newBalance,
          transactionId: result.transactionId
        }
      });
    } catch (error) {
      if (error.message === 'Account not found') {
        return res.status(404).json({
          success: false,
          error: 'Account number not found'
        });
      }
      next(error);
    }
  },

  getDashboardStats: async (req, res, next) => {
    try {
      const [
        totalUsers,
        pendingKYC,
        pendingCards,
        pendingTransactions
      ] = await Promise.all([
        User.countDocuments(),
        KYC.countDocuments({ status: 'processing' }),
        Card.countDocuments({ status: 'pending' }),
        Transaction.countDocuments({ status: 'pending' })
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          pendingKYC,
          pendingCards,
          pendingTransactions
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const { search } = req.query;
      let query = {};

      if (search) {
        query = {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const users = await User.find(query).select('-password');
      const usersWithBalance = await Promise.all(
        users.map(async (user) => {
          const account = await Account.findOne({ userId: user._id });
          return {
            ...user.toObject(),
            balance: account?.balance || 0
          };
        })
      );

      res.status(200).json({
        success: true,
        data: usersWithBalance
      });
    } catch (error) {
      next(error);
    }
  },

  getCardRequests: async (req, res, next) => {
    try {
      const cardRequests = await Card.find()
        .populate('userId', 'fullName email')
        .sort('-createdAt');

      res.status(200).json({
        success: true,
        data: cardRequests
      });
    } catch (error) {
      next(error);
    }
  },

  updateCardStatus: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const { status } = req.body;

      const card = await Card.findByIdAndUpdate(
        cardId,
        { status },
        { new: true }
      ).populate('userId', 'fullName email');

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Card request not found'
        });
      }

      await Notification.create({
        userId: card.userId,
        title: 'Card Request Update',
        message: `Your card request has been ${status}`,
        type: status === 'approved' ? 'success' : 'info'
      });

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  },

  getAdminNotifications: async (req, res, next) => {
    try {
      const notifications = await Notification.find({ isAdmin: true })
        .sort('-createdAt')
        .limit(20);

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },

  markNotificationsAsRead: async (req, res, next) => {
    try {
      const { notificationIds } = req.body;

      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { isRead: true }
      );

      res.status(200).json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      next(error);
    }
  }
};