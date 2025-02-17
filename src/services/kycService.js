import { KYC } from '../models/KYC.js';
import { emailService } from '../utils/email/emailService.js';
import { ValidationError } from '../utils/errors.js';

export const kycService = {
  async submitKYC(userId, kycData) {
    const existingKYC = await KYC.findOne({ userId });

    // Check the current KYC status
    if (existingKYC) {
      if (existingKYC.status === 'processing') {
        throw new ValidationError('KYC verification is already in progress. Please wait for the review.');
      } else if (existingKYC.status === 'approved') {
        throw new ValidationError('KYC has already been approved. You cannot submit again.');
      } else if (existingKYC.status === 'rejected') {
        // Allow resubmission if rejected
        return await KYC.findByIdAndUpdate(existingKYC._id, { ...kycData, status: 'processing' }, { new: true });
      }
    }

    // If no existing KYC, create a new one
    return await KYC.create({
      userId,
      ...kycData,
      status: 'processing' // Set status to processing for new submissions
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