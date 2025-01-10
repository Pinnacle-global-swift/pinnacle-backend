import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { KYC } from '../models/KYC.js';
import { KYC_STATUS } from '../constants/status.js';

export const adminDashboardController = {
  async getDashboardStats(req, res, next) {
    try {
      const [
        totalUsers,
        activeUsers,
        totalTransactions,
        pendingKYC
      ] = await Promise.all([
        // Total Users Count
        User.countDocuments(),
        
        // Active Users (users who have made at least one transaction)
        User.countDocuments({
          _id: {
            $in: await Transaction.distinct('userId')
          }
        }),
        
        // Total Transactions Count
        Transaction.countDocuments(),
        
        // Pending KYC Applications
        KYC.countDocuments({ status: KYC_STATUS.PROCESSING })
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          totalTransactions,
          pendingKYC
        }
      });
    } catch (error) {
      next(error);
    }
  }
};