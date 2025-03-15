import { withdrawalService } from '../services/withdrawalService.js';
import { generateReceipt } from '../utils/receiptGenerator.js';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

export const withdrawalController = {
  withdraw: async (req, res, next) => {
    try {
      const { amount, withdrawalMethod, accountNumber, swiftCode } = req.body;

      // Check prerequisites first
      try {
        await withdrawalService.checkPrerequisites(req.user.id);
      } catch (error) {
        return res.status(error.statusCode || 403).json({
          success: false,
          error: {
            message: error.message,
            code: error.statusCode || 403,
            details: {
              requiresKYC: error.message.includes('KYC'),
              requiresCard: error.message.includes('card'),
              cardStatus: error.message.includes('card') ? 'required' : undefined
            }
          }
        });
      }

      // Process withdrawal
      const transaction = await withdrawalService.processWithdrawal(
        req.user.id,
        {
          amount,
          withdrawalMethod,
          accountNumber,
          swiftCode
        }
      );

      const receipt = await generateReceipt(transaction);

      try {
        await emailService.sendEmail(req.user.email, {
          subject: 'PINNACLE GLOBAL SWIFT - Withdrawal Confirmation',
          html: receipt
        });
      } catch (emailError) {
        logger.error('Failed to send withdrawal confirmation email:', emailError);
      }

      res.status(200).json({
        success: true,
        data: {
          transaction,
          receipt
        }
      });
    } catch (error) {
      next(error);
    }
  }
};