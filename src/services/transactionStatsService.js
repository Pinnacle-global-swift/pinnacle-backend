import { Transaction } from '../models/Transaction.js';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../constants/status.js';

class TransactionStatsService {
  async getUserTransactionTotals(userId) {
    const [withdrawalTotal, depositTotal] = await Promise.all([
      // Get total withdrawals
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: TRANSACTION_TYPE.WITHDRAWAL,
            status: TRANSACTION_STATUS.COMPLETED
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      
      // Get total deposits
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: TRANSACTION_TYPE.DEPOSIT,
            status: TRANSACTION_STATUS.COMPLETED
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    return {
      totalWithdrawn: withdrawalTotal[0]?.total || 0,
      totalDeposited: depositTotal[0]?.total || 0
    };
  }
}

export const transactionStatsService = new TransactionStatsService();