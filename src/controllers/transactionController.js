import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';

export const transactionController = {
  async getUserTransactions(req, res, next) {
    try {
      const { page = 1, limit = 10, type, startDate, endDate } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = { userId: req.user.id };
      if (type) query.type = type;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Get transactions with pagination
      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-metadata'),
        Transaction.countDocuments(query)
      ]);

      const pages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            pages,
            page: parseInt(page),
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllTransactions(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type, 
        userId, 
        status,
        startDate, 
        endDate 
      } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = {};
      if (type) query.type = type;
      if (userId) query.userId = userId;
      if (status) query.status = status;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Get transactions with user details
      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('userId', 'fullName email'),
        Transaction.countDocuments(query)
      ]);

      const pages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            pages,
            page: parseInt(page),
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};