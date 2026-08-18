import { KYC } from '../models/KYC.js';
import { User } from '../models/User.js';
import { KYC_STATUS } from '../constants/status.js';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';
import { EmailTemplates } from '../utils/email/emailTemplates.js';

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

      // Send email notification
      if (user?.email) {
        await emailService.sendEmail(
          user.email,
          EmailTemplates.kycStatusUpdate(user.fullName, status, remarks)
        );
      }

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
      const { status, page = 1, limit = 10 } = req.query;
      const query = status ? { status } : {};

      const kycs = await KYC.find(query)
        .populate('userId', 'email fullName')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await KYC.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          kycs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectKyc(req, res, next) {
    try {
      const { kycId, remarks } = req.body;

      // Default professional remark if none provided
      const defaultRemark = `We regret to inform you that your KYC application could not be approved at this time. 
      Please ensure all submitted documents are:
      - Clear and legible
      - Not expired
      - Properly aligned and complete
      - Match the information provided in your application
      
      You may resubmit your application with updated documentation at any time.`;

      // Populate the userId field to get user details
      const kyc = await KYC.findById(kycId).populate('userId', 'email fullName');
      if (!kyc) {
        return res.status(404).json({
          success: false,
          error: 'KYC application not found'
        });
      }

      if (!kyc.userId || !kyc.userId.email) {
        return res.status(400).json({
          success: false,
          error: 'User information not found'
        });
      }

      // Update KYC status to rejected
      kyc.status = 'rejected';
      kyc.remarks = remarks || defaultRemark; // Use provided remarks or default
      await kyc.save();

      // Send email notification to the user
      try {
        await emailService.sendEmail(
          kyc.userId.email,
          EmailTemplates.kycStatusUpdate(kyc.userId.fullName, 'rejected', kyc.remarks)
        );
      } catch (emailError) {
        logger.error('Failed to send KYC rejection email:', emailError);
        // Continue with the response even if email fails
      }

      res.status(200).json({
        success: true,
        message: 'KYC application rejected successfully',
        data: kyc
      });
    } catch (error) {
      logger.error('Error rejecting KYC:', error);
      next(error);
    }
  }
};