import { KYC } from '../models/KYC.js';
import { User } from '../models/User.js';
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

  async approveKYC(kycId, status, remarks, adminId) {
    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      throw new ValidationError('KYC not found');
    }

    // Record who approved/rejected the KYC
    kyc.status = status;
    kyc.remarks = remarks;
    kyc.verificationDate = new Date();
    kyc.processedBy = adminId;
    await kyc.save();

    // Update user KYC status
    await User.findByIdAndUpdate(kyc.userId, {
      kycVerified: status === 'approved',
      kycStatus: status
    });

    return kyc;
  },

  async getKYCStatus(userId) {
    const kyc = await KYC.findOne({ userId }).sort('-createdAt');

    if (!kyc) {
      return {
        status: 'none',
        message: 'KYC not submitted yet. Please submit your KYC verification.'
      };
    }

    return {
      status: kyc.status,
      submittedAt: kyc.createdAt,
      verificationDate: kyc.verificationDate,
      remarks: kyc.remarks,
      message: this.getKYCStatusMessage(kyc.status)
    };
  },

  getKYCStatusMessage(status) {
    switch (status) {
      case 'processing':
        return 'Your KYC is under review. This usually takes 24-48 hours.';
      case 'approved':
        return 'Your KYC has been approved. You can now perform all transactions.';
      case 'rejected':
        return 'Your KYC was rejected. Please submit updated documents.';
      default:
        return 'Please submit your KYC verification.';
    }
  }
};