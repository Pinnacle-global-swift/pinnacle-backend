import { User } from '../models/User.js';
import { UserSettings } from '../models/UserSettings.js';
import { Account } from '../models/Account.js';
import { Card } from '../models/Card.js';


export const userController = {
  // Update profile
  updateProfile: async (req, res, next) => {
    try {
      const { fullName, phoneNumber, address } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { fullName, phoneNumber, address },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  // Update language preference
  updateLanguage: async (req, res, next) => {
    try {
      const { language } = req.body;

      let userSettings = await UserSettings.findOne({ userId: req.user.id });

      if (!userSettings) {
        userSettings = await UserSettings.create({
          userId: req.user.id,
          language
        });
      } else {
        userSettings.language = language;
        await userSettings.save();
      }

      res.status(200).json({
        success: true,
        data: userSettings
      });
    } catch (error) {
      next(error);
    }
  },

  // Update transaction limits
  updateTransactionLimits: async (req, res, next) => {
    try {
      const { dailyTransfer, dailyWithdrawal, cardSpending } = req.body;

      let userSettings = await UserSettings.findOne({ userId: req.user.id });

      if (!userSettings) {
        userSettings = await UserSettings.create({
          userId: req.user.id,
          transactionLimits: {
            dailyTransfer,
            dailyWithdrawal,
            cardSpending
          }
        });
      } else {
        userSettings.transactionLimits = {
          dailyTransfer: Math.min(dailyTransfer, 5000),
          dailyWithdrawal: Math.min(dailyWithdrawal, 2000),
          cardSpending: Math.min(cardSpending, 10000)
        };
        await userSettings.save();
      }

      res.status(200).json({
        success: true,
        data: userSettings
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user settings
  getSettings: async (req, res, next) => {
    try {
      const userSettings = await UserSettings.findOne({ userId: req.user.id });

      if (!userSettings) {
        return res.status(404).json({
          success: false,
          error: 'User settings not found'
        });
      }

      res.status(200).json({
        success: true,
        data: userSettings
      });
    } catch (error) {
      next(error);
    }
  },

  // Add this method to the existing userController
  getUserDetails: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get account information
      const account = await Account.findOne({ userId: user._id }).lean();

      // Get card information
      const card = await Card.findOne({ userId: user._id }).lean();

      // Get user settings
      const settings = await UserSettings.findOne({ userId: user._id }).lean();

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            phoneNumber: user.phoneNumber,
            address: user.address
          },
          account: account ? {
            accountNumber: account.accountNumber,
            balance: account.balance,
            currency: account.currency,
            status: account.status
          } : null,
          card: card ? {
            type: card.type,
            status: card.status,
            limit: card.limit,
            expiryDate: card.expiryDate
          } : null,
          settings: settings ? {
            language: settings.language,
            transactionLimits: settings.transactionLimits
          } : null
        }
      });
    } catch (error) {
      next(error);
    }
  }

};