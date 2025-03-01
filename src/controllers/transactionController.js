import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { Account } from '../models/Account.js';

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

      // Get user account details
      const userAccount = await Account.findOne({ userId: req.user.id });

      // Get transactions with pagination and detailed information
      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('userId', 'fullName email')
          .select(`
            type amount status reference description balanceAfter
            currency createdAt metadata 
            transactionFee exchangeRate remarks
          `),
        Transaction.countDocuments(query)
      ]);

      // Enhance transaction data with receipt-ready information
      const enhancedTransactions = transactions.map(transaction => ({
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        reference: transaction.reference,
        description: transaction.description,
        balanceAfter: transaction.balanceAfter,
        transactionFee: transaction.transactionFee || 0,
        exchangeRate: transaction.exchangeRate || 1,
        date: transaction.createdAt,
        formattedDate: new Date(transaction.createdAt).toLocaleString(),
        accountDetails: {
          accountHolder: transaction.userId.fullName,
          accountNumber: userAccount.accountNumber,
          email: transaction.userId.email
        },
        transferDetails: transaction.type === 'transfer' ? {
          recipientName: transaction.metadata?.recipientName,
          recipientAccount: transaction.metadata?.accountNumber,
          senderName: transaction.metadata?.senderName,
          transferType: transaction.metadata?.transferType,
          bankName: transaction.metadata?.bankName,
          swiftCode: transaction.metadata?.swiftCode
        } : null,
        withdrawalDetails: transaction.type === 'withdrawal' ? {
          withdrawalMethod: transaction.metadata?.withdrawalMethod,
          accountNumber: transaction.metadata?.accountNumber,
          bankName: transaction.metadata?.bankName,
          swiftCode: transaction.metadata?.swiftCode
        } : null,
        depositDetails: transaction.type === 'deposit' ? {
          depositMethod: transaction.metadata?.depositMethod,
          depositedBy: transaction.metadata?.depositedBy,
          senderName: transaction.metadata?.senderName
        } : null,
        remarks: transaction.remarks,
        receiptNumber: `RCP-${transaction.reference}`,
        bankDetails: {
          bankName: 'Pinnacle Global Bank',
          swiftCode: 'PNGLBUS22',
          address: '123 Financial District, NY 10004'
        }
      }));

      const pages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        data: {
          transactions: enhancedTransactions,
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