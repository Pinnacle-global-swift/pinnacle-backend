import { User } from '../models/User.js';
import { emailService } from '../utils/email/emailService.js';
import { generateOTP } from '../utils/otpUtils.js';
import { authEmailTemplates } from '../utils/email/templates/authTemplates.js';

export const verificationController = {
  checkVerificationStatus: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          isVerified: user.isVerified,
          email: user.email,
          verificationAttempts: user.verificationAttempts
        }
      });
    } catch (error) {
      next(error);
    }
  },

  resendVerification: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: 'Account is already verified'
        });
      }

      // Check for too many attempts
      if (user.verificationAttempts >= 3) {
        const lastAttempt = user.lastVerificationAttempt;
        const cooldownPeriod = 30 * 60 * 1000; // 30 minutes

        if (lastAttempt && Date.now() - lastAttempt.getTime() < cooldownPeriod) {
          return res.status(429).json({
            success: false,
            error: 'Too many verification attempts. Please try again later.'
          });
        }
        // Reset attempts after cooldown
        user.verificationAttempts = 0;
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.verificationAttempts += 1;
      user.lastVerificationAttempt = new Date();
      await user.save();

      // Send verification email
      await emailService.sendEmail(
        email,
        authEmailTemplates.otpVerification(
          user.fullName,
          otp,
          user.uniqueId,
          user.accountType
        )
      );

      res.status(200).json({
        success: true,
        message: 'Verification code has been resent'
      });
    } catch (error) {
      next(error);
    }
  }
};