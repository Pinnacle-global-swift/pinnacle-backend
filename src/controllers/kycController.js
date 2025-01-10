import { kycService } from '../services/kycService.js';
import { emailService } from '../utils/email/emailService.js';
import {EmailTemplates } from "../utils/email/emailTemplates.js"


export const kycController = {
  submitKYC: async (req, res, next) => {
    try {
      const kyc = await kycService.submitKYC(req.user.id, req.body);

      await emailService.sendEmail(req.user.email,
        EmailTemplates.verifyKys()
   
    );

      res.status(201).json({
        success: true,
        data: kyc
      });
    } catch (error) {
      next(error);
    }
  },

  getKYCStatus: async (req, res, next) => {
    try {
      const status = await kycService.getKYCStatus(req.user.id);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
};