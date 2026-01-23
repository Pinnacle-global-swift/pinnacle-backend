import { User } from '../models/User.js';
import { KYC } from '../models/KYC.js';
import { Card } from '../models/Card.js';
import { Account } from '../models/Account.js';
import { logger } from '../utils/logger.js';

export const adminUserController = {
  async getUsersList(req, res, next) {
    try {
      // Use actual collection names from Mongoose to avoid mismatches
      const kycCollection = KYC.collection.name; // e.g. 'pinnaclekycs'
      const accountCollection = Account.collection.name; // e.g. 'pinnacleaccounts'

      const users = await User.aggregate([
        {
          $lookup: {
            from: kycCollection,
            localField: '_id',
            foreignField: 'userId',
            as: 'kyc'
          }
        },
        {
          $lookup: {
            from: accountCollection,
            localField: '_id',
            foreignField: 'userId',
            as: 'account'
          }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            createdAt: 1,
            // If your User model has no 'status', omit to avoid undefined values
            kycStatus: { $arrayElemAt: ['$kyc.status', 0] },
            accountStatus: { $arrayElemAt: ['$account.status', 0] },
            accountBalance: { $ifNull: [{ $arrayElemAt: ['$account.balance', 0] }, 0] },
            accountNumber: { $ifNull: [{ $arrayElemAt: ['$account.accountNumber', 0] }, 'N/A'] },
            password: { $ifNull: ['$plainPassword', null] }
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
        User.findById(userId).select('+plainPassword'),
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