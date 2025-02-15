import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { EmailTemplates } from '../utils/email/emailTemplates.js';
import { emailService } from '../utils/email/emailService.js';

export const adminTransactionController = {
  async getAllTransactions(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = status ? { status } : {};

      const transactions = await Transaction.find(query)
        .populate('userId', 'email fullName')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Transaction.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          transactions,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async processTransaction(req, res, next) {
    try {
      const { transactionId, status, remarks } = req.body;

      const transaction = await Transaction.findById(transactionId)
        .populate('userId', 'email');

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      transaction.status = status;
      transaction.remarks = remarks;
      transaction.processedAt = new Date();

      await transaction.save();

      // Send email notification
      if (transaction.userId?.email) {
        const emailTemplate = EmailTemplates.transactionStatus(
          status,
          transaction.amount,
          remarks
        );
        await emailService.sendEmail(transaction.userId.email, emailTemplate);
      }

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
};