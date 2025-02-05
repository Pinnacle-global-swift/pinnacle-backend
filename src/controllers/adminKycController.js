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
            from: 'pinnacleusers',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            applicantName: '$fullName',
            'user.fullName': 1,
            'user.email': 1,
            'user.phoneNumber': 1,
            documentType: '$idType',
            documentNumber: '$idNumber',
            dateOfBirth: 1,
            documents: 1,
            status: 1,
            submittedAt: '$createdAt',
            additionalInfo: 1,
            remarks: 1
          }
        },
        {
          $sort: { submittedAt: -1 }
        }
      ]);

      const stats = {
        totalPending: kycApplications.length,
        withPassport: kycApplications.filter(app => app.documentType === 'passport').length,
        withNationalId: kycApplications.filter(app => app.documentType === 'national_id').length,
        withDriversLicense: kycApplications.filter(app => app.documentType === 'drivers_license').length,
        documentsSubmitted: kycApplications.filter(app => 
          app.documents?.idFront && 
          app.documents?.idBack && 
          app.documents?.selfie && 
          app.documents?.proofOfAddress
        ).length
      };

      const formattedApplications = kycApplications.map(app => ({
        _id: app._id,
        applicantDetails: {
          name: app.applicantName,
          email: app.user.email,
          phoneNumber: app.user.phoneNumber,
          dateOfBirth: app.dateOfBirth
        },
        documentInfo: {
          type: app.documentType,
          number: app.documentNumber,
          documents: {
            idFront: app.documents?.idFront ? true : false,
            idBack: app.documents?.idBack ? true : false,
            selfie: app.documents?.selfie ? true : false,
            proofOfAddress: app.documents?.proofOfAddress ? true : false
          }
        },
        status: app.status,
        submittedAt: app.submittedAt,
        remarks: app.remarks || null,
        additionalInfo: app.additionalInfo || null
      }));

      res.status(200).json({
        success: true,
        data: {
          applications: formattedApplications,
          statistics: stats,
          totalCount: kycApplications.length
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async approveKyc(req, res, next) {
    try {
      const { kycId, status, remarks } = req.body;

      console.log(kycId, status, remarks)

      const kyc = await KYC.findById(kycId);
      if (!kyc) {
        return res.status(404).json({
          success: false,
          error: 'KYC application not found'
        });

      }

      console.log("fullkyc", kyc)

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
      console.log(user, "ss", kyc.userId)

      // Send email notification
      await emailService.sendEmail(user.email, {
        subject: `PINNACLE GLOBAL SWIFT - KYC Verification ${status === KYC_STATUS.APPROVED ? 'Approved' : 'Rejected'}`,
        html: `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - KYC Verification Status</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgbw.png?alt=media&token=bbf2f313-a323-467f-a87e-d555f4337e15" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">KYC Verification Status</h1>
                            <p style="margin: 0 0 20px; font-size: 16px;">Dear ${user?.fullLegalName},</p>
                            
                            <!-- Status Message -->
                            <div style="background-color: ${status === KYC_STATUS.APPROVED ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 18px; color: ${status === KYC_STATUS.APPROVED ? '#2e7d32' : '#c62828'};">
                                                Your KYC verification has been <strong>${status === KYC_STATUS.APPROVED ? 'approved' : 'rejected'}</strong>
                                            </p>
                                            ${remarks ? `
                                            <p style="margin: 10px 0 0; color: #666666;">
                                                <strong>Remarks:</strong> ${remarks}
                                            </p>
                                            ` : ''}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Next Steps -->
                            ${status === KYC_STATUS.APPROVED ? `
                            <div style="margin: 20px 0;">
                                <p style="margin: 0 0 10px;"><strong>Next Steps:</strong></p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">You now have full access to all account features</li>
                                    <li style="margin-bottom: 10px;">You can proceed with transactions and transfers</li>
                                    <li>Explore our complete range of banking services</li>
                                </ul>
                            </div>
                            ` : `
                            <div style="margin: 20px 0;">
                                <p style="margin: 0 0 10px;"><strong>What you can do:</strong></p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Review the rejection remarks above</li>
                                    <li style="margin-bottom: 10px;">Update your documents and resubmit</li>
                                    <li>Contact our support team for assistance</li>
                                </ul>
                            </div>
                            `}

                            <!-- Action Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">View Account Details</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-style: italic; color: #666666;">If you have any questions, please don't hesitate to contact our support team.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 10px 0 0;">
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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
  },

  async getAllKyc(req, res, next) {
    try {
      const { status } = req.query;
      
      // Build match condition based on status filter
      const matchCondition = status ? { status } : {};

      const kycApplications = await KYC.aggregate([
        {
          $match: matchCondition
        },
        {
          $lookup: {
            from: 'pinnacleusers',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            applicantName: '$fullName',
            'user.fullName': 1,
            'user.email': 1,
            'user.phoneNumber': 1,
            documentType: '$idType',
            documentNumber: '$idNumber',
            dateOfBirth: 1,
            documents: 1,
            status: 1,
            submittedAt: '$createdAt',
            verificationDate: 1,
            additionalInfo: 1,
            remarks: 1
          }
        },
        {
          $sort: { submittedAt: -1 }
        }
      ]);

      const stats = {
        total: kycApplications.length,
        approved: kycApplications.filter(app => app.status === 'approved').length,
        rejected: kycApplications.filter(app => app.status === 'rejected').length,
        processing: kycApplications.filter(app => app.status === 'processing').length,
        withPassport: kycApplications.filter(app => app.documentType === 'passport').length,
        withNationalId: kycApplications.filter(app => app.documentType === 'national_id').length,
        withDriversLicense: kycApplications.filter(app => app.documentType === 'drivers_license').length,
        documentsSubmitted: kycApplications.filter(app => 
          app.documents?.idFront && 
          app.documents?.idBack && 
          app.documents?.selfie && 
          app.documents?.proofOfAddress
        ).length
      };

      const formattedApplications = kycApplications.map(app => ({
        _id: app._id,
        applicantDetails: {
          name: app.applicantName,
          email: app.user.email,
          phoneNumber: app.user.phoneNumber,
          dateOfBirth: app.dateOfBirth
        },
        documentInfo: {
          type: app.documentType,
          number: app.documentNumber,
          documents: {
            idFront: app.documents?.idFront ? true : false,
            idBack: app.documents?.idBack ? true : false,
            selfie: app.documents?.selfie ? true : false,
            proofOfAddress: app.documents?.proofOfAddress ? true : false
          }
        },
        status: app.status,
        submittedAt: app.submittedAt,
        verificationDate: app.verificationDate || null,
        remarks: app.remarks || null,
        additionalInfo: app.additionalInfo || null
      }));

      res.status(200).json({
        success: true,
        data: {
          applications: formattedApplications,
          statistics: stats,
          totalCount: kycApplications.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
};