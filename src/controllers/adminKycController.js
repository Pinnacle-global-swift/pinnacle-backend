import { KYC } from '../models/KYC.js';
import { User } from '../models/User.js';
import { KYC_STATUS } from '../constants/status.js';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

export const adminKycController = {

  async getPendingKyc(req, res, next) {
    try {
      const kycApplications = await KYC.aggregate([
        {
          $match: { status: 'processing' }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            'user.fullName': 1,
            documentType: '$idType',
            documentNumber: '$idNumber',
            status: 1,
            submittedAt: '$createdAt'
          }
        }
      ]);


      console.log(kycApplications)

      res.status(200).json({
        success: true,
        data: kycApplications
      });
    } catch (error) {
      next(error);
    }
  },



  async approveKyc(req, res, next) {
    try {
      const { kycId, status, remarks } = req.body;

      const kyc = await KYC.findById(kycId);
      if (!kyc) {
        return res.status(404).json({
          success: false,
          error: 'KYC application not found'
        });
      }

      if (kyc.status !== KYC_STATUS.PROCESSING) {
        return res.status(400).json({
          success: false,
          error: 'KYC application already processed'
        });
      }

      // Update KYC status
      kyc.status = status;
      kyc.verificationDate = new Date();
      kyc.remarks = remarks;
      await kyc.save();

      // Get user details for email notification
      const user = await User.findById(kyc.userId);

      // Send email notification
      await emailService.sendEmail(user.email, {
        subject: `PINNACLE GLOBAL SWIFT - KYC Verification ${status === KYC_STATUS.APPROVED ? 'Approved' : 'Rejected'}`,
        html: `
          <p>Dear ${user.fullName},</p>
          <p>Your KYC verification has been ${status === KYC_STATUS.APPROVED ? 'approved' : 'rejected'}.</p>
          ${remarks ? `<p>Remarks: ${remarks}</p>` : ''}
        `
      });

      logger.info(`KYC ${kycId} ${status} by admin ${req.user.id}`);

      res.status(200).json({
        success: true,
        data: kyc
      });
    } catch (error) {
      next(error);
    }
  }
};