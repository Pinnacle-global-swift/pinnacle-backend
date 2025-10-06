import { kycService } from '../services/kycService.js';
import { emailService } from '../utils/email/emailService.js';
import { EmailTemplates } from "../utils/email/emailTemplates.js"
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { User } from '../models/User.js';


export const kycController = {
  submitKYC: async (req, res, next) => {
    try {
      // Debug log
      console.log('Received files:', Object.keys(req.files || {}));
      console.log('Received body:', req.body);

      // Validate if files exist
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files were uploaded'
        });
      }

      // Handle file uploads first
      const uploadPromises = [];
      const requiredFiles = ['idFront', 'idBack', 'proofOfAddress'];
      const missingFiles = [];
      
      // Check for missing files
      for (const fileKey of requiredFiles) {
        if (!req.files[fileKey] || !req.files[fileKey][0]) {
          missingFiles.push(fileKey);
        }
      }

      // If any required files are missing, return error with all missing files
      if (missingFiles.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required files: ${missingFiles.join(', ')}`
        });
      }
      
      // Process uploads
      for (const [key, files] of Object.entries(req.files)) {
        if (files && files[0]) {
          uploadPromises.push(
            uploadToCloudinary(files[0], `kyc/${key}`)
              .then(url => ({ [key]: url }))
              .catch(error => {
                console.error(`Error uploading ${key}:`, error);
                throw new Error(`Failed to upload ${key}: ${error.message}`);
              })
          );
        }
      }

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      
      // Combine all document URLs
      const documents = uploadResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});

      // Combine form data with document URLs
      const kycData = {
        ...req.body,
        documents
      };

      const kyc = await kycService.submitKYC(req.user.id, kycData);

      // Get user details including email
      const user = await User.findById(req.user.id);
      if (!user || !user.email) {
        throw new Error('User email not found');
        
      }

      // Send email notification using the template
      const emailTemplate = EmailTemplates.verifyKyc();
      await emailService.sendEmail(
        user.email,
        emailTemplate
      );

      res.status(201).json({
        success: true,
        data: kyc
      });
    } catch (error) {
      console.error('KYC Submission Error:', error);
      
      // Send a more user-friendly error response
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to submit KYC documents',
          code: error.code || 500
        }
      });
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