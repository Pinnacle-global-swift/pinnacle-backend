import { KYC } from '../models/KYC.js';
import { emailService } from '../utils/email/emailService.js';

export const kycService = {
  async submitKYC(userId, kycData) {
    const existingKYC = await KYC.findOne({ userId });
    if (existingKYC) {
      throw new Error('KYC verification already submitted');
    }

    return await KYC.create({
      userId,
      ...kycData
    });
  },

  async getKYCStatus(userId) {
    const kyc = await KYC.findOne({ userId });
    if (!kyc) {
      throw new Error('KYC verification not found');
    }

    return {
      status: kyc.status,
      submittedAt: kyc.createdAt,
      verificationDate: kyc.verificationDate
    };
  }
};