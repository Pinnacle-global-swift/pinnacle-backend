import { User } from '../models/User.js';
import { KYC } from '../models/KYC.js';
import { Card } from '../models/Card.js';
import { Account } from '../models/Account.js';
import { logger } from '../utils/logger.js';

export const adminUserController = {
  async getUsersList(req, res, next) {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: 'kycs',
            localField: '_id',
            foreignField: 'userId',
            as: 'kyc'
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: '_id',
            foreignField: 'userId',
            as: 'account'
          }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            status: 1,
            kycStatus: { $arrayElemAt: ['$kyc.status', 0] },
            accountStatus: { $arrayElemAt: ['$account.status', 0] },
            accountBalance: { $arrayElemAt: ['$account.balance', 0] },
            createdAt: 1
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserDetails(req, res, next) {
    try {
      const { userId } = req.params;

      const [user, kyc, card, account] = await Promise.all([
        User.findById(userId).select('-password'),
        KYC.findOne({ userId }),
        Card.findOne({ userId }),
        Account.findOne({ userId })
      ]);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user,
          kyc,
          card,
          account
        }
      });
    } catch (error) {
      next(error);
    }
  }
};