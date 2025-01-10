import { transactionStatsService } from '../services/transactionStatsService.js';

export const transactionStatsController = {
  async getTransactionTotals(req, res, next) {
    try {
      const totals = await transactionStatsService.getUserTransactionTotals(req.user.id);
      
      res.status(200).json({
        success: true,
        data: totals
      });
    } catch (error) {
      next(error);
    }
  }
};