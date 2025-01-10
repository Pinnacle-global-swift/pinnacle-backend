import { Account } from '../models/Account.js';

export const accountController = {
  // Get account information
  getAccountInfo: async (req, res, next) => {
    try {
      const account = await Account.findOne({ userId: req.user.id });
      
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      res.status(200).json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  }
};