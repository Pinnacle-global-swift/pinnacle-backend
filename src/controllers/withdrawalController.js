import { withdrawalService } from '../services/withdrawalService.js';
import { generateReceipt } from '../utils/receiptGenerator.js';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

export const withdrawalController = {
  withdraw: async (req, res, next) => {
    try {
      const { amount, withdrawalMethod, accountNumber, swiftCode } = req.body;

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