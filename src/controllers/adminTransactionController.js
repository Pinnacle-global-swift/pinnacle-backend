import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { emailService } from '../utils/email/emailService.js';

export const adminTransactionController = {
  async getPendingTransactions(req, res, next) {
    try {
      const transactions = await Transaction.aggregate([
        {
          $match: { status: 'processing' }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            'user.fullName': 1,
            amount: 1,
            type: 1,
            status: 1,
            createdAt: 1
          }
        }
      ]);
      console.log(transactions)

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  },

  async approveTransaction(req, res, next) {
    try {
      const { transactionId, status, remarks } = req.body;
   
      

      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }
console.log(transaction)
      transaction.status = status;
      transaction.remarks = remarks;
      await transaction.save();

      // Send email notification
      const user = await User.findById(transaction.userId);
      await emailService.sendEmail(user.email, {
        subject: `Transaction ${status}`,
        html: `Your ${transaction.type} transaction of $${transaction.amount} has been ${status}. ${remarks || ''}`
      });

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
};