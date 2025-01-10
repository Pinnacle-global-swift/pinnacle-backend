import { transferService } from '../services/transferService.js';
import { emailService } from '../utils/email/emailService.js';
import {EmailTemplates } from "../utils/email/emailTemplates.js"


export const transferController = {
  async transfer(req, res, next) {
    try {
      const { accountNumber, beneficiaryName, amount, description } = req.body;
      console.log(accountNumber)
      
      const transaction = await transferService.processTransfer(
        req.user.id,
        {
          accountNumber,
          beneficiaryName,
          amount,
          description
        }
      );

      // Send email notification
      await emailService.sendEmail(req.user.email, 
        EmailTemplates.transferConfirmation(amount,beneficiaryName,  accountNumber, transaction.reference) 
    
    );

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
};