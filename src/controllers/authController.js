import { User } from '../models/User.js';
import { Account } from '../models/Account.js';
import { TokenBlacklist } from '../models/TokenBlacklist.js';
import { generateUniqueId } from '../utils/uniqueIdGenerator.js';
import { generateAccountNumber } from '../utils/accountUtils.js';
import { emailNotificationService } from '../services/emailNotificationService.js';
// import { sendEmail } from '../utils/emailService.js';
import { emailService } from '../utils/email/emailService.js';
import { generateOTP, isOTPValid } from '../utils/otpUtils.js';
import { authEmailTemplates } from '../utils/email/authTemplates.js';
import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import crypto from 'crypto';
import { config } from '../config/config.js';
import { getDeviceInfo } from '../utils/deviceInfo.js';
import { TOKEN_EXPIRATION_TIME } from '../config/constants.js';
import jwt from 'jsonwebtoken';

export const authController = {
  // Register new user
  register: async (req, res, next) => {
    try {
      const {
        accountType,
        fullName,
        gender,
        email,
        password,
        country,
        address,
        phoneNumber
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes

      // Generate unique ID and account number
      const uniqueId = generateUniqueId();
      const accountNumber = generateAccountNumber();

      // Create user with OTP
      const user = await User.create({
        accountType,
        fullName,
        gender,
        email,
        password,
        country,
        address,
        phoneNumber,
        uniqueId,
        otp,
        otpExpiry,
        isVerified: false
      });

      // otpExpiry

      console.log(user, "voke s")

      // Create account for user
      await Account.create({
        userId: user._id,
        accountNumber,
        balance: 0
      });

      // Send OTP email
      await emailService.sendEmail(
        email,
        authEmailTemplates.otpVerification(fullName, user.accountType, user.uniqueId, otp)
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email with the OTP sent.'
      });
    } catch (error) {
      next(error);
    }
  },


  // Login user
  // login: async (req, res, next) => {
  //   try {
  //     const { email, password } = req.body;

  //     // Check if user exists
  //     const user = await User.findOne({ email }).select('+password');
  //     if (!user) {
  //       return res.status(401).json({
  //         success: false,
  //         error: 'Invalid credentials'
  //       });
  //     }

  //     // Check if password matches
  //     const isMatch = await user.matchPassword(password);
  //     if (!isMatch) {
  //       return res.status(401).json({
  //         success: false,
  //         error: 'Invalid credentials'
  //       });
  //     }

  //     // Check if account is verified
  //     if (!user.isVerified) {
  //       return res.status(401).json({
  //         success: false,
  //         error: 'Please verify your email first'
  //       });
  //     }

  //     // Generate token
  //     const token = generateToken(user._id);

  //     res.status(200).json({
  //       success: true,
  //       token,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role
  //       }
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },


  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Get device info
      const deviceInfo = getDeviceInfo(req);

      // Send login alert
      await emailNotificationService.sendLoginAlert(user, deviceInfo);

      // Generate token with user object (includes role)
      const token = generateToken(user, user.role);
      
      // Decode token to get expiration time
      const decoded = jwt.decode(token);
      const expiresAt = new Date(decoded.exp * 1000); // Convert UNIX timestamp to milliseconds

      res.status(200).json({
        success: true,
        token,
        expires_at: expiresAt.toISOString(), // Send ISO string format of expiration time
        data: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          uniqueId: user.uniqueId,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },


  resendOTP: async (req, res, next) => {
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
          error: 'Email already verified'
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Send new OTP email
      await emailService.sendEmail(
        email,
        authEmailTemplates.otpVerification(user.fullName, otp)
      );

      res.status(200).json({
        success: true,
        message: 'New OTP sent successfully'
      });
    } catch (error) {
      next(error);
    }
  },


  verifyOTP: async (req, res, next) => {
    try {
      const { email, otp } = req.body;

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
          error: 'Email already verified'
        });
      }



      if (!isOTPValid(user.otp, otp, user.otpExpiry)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP'
        });
      }

      // Update user verification status
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  },


  // Verify email
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        verificationToken: token,
        verificationExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationExpire = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Forgot password
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No account found with this email'
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes

      // Save OTP to user
      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpiry = otpExpiry;
      await user.save();

      // Send reset password email
      await emailService.sendEmail(
        email,
        authEmailTemplates.forgotPassword(user.fullName, otp, user.uniqueId)
      );

      res.status(200).json({
        success: true,
        message: 'Password reset OTP has been sent to your email'
      });
    } catch (error) {
      next(error);
    }
  },

  verifyResetOTP: async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No account found with this email'
        });
      }

      if (!isOTPValid(user.resetPasswordOTP, otp, user.resetPasswordOTPExpiry)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP'
        });
      }

      // Generate reset token
      const resetToken = generateToken(user._id);

      res.status(200).json({
        success: true,
        resetToken
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update password
      user.password = password;
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      await user.save();

      // Send password changed confirmation email
      await emailService.sendEmail(
        user.email,
        authEmailTemplates.passwordChanged(user.fullName, user.uniqueId)
      );

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Logout user
  logout: async (req, res, next) => {
    try {
      const token = req.token;

      try {
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000); // Convert exp to milliseconds

        // Add token to blacklist
        await TokenBlacklist.create({
          token,
          expiresAt
        });

        res.status(200).json({
          success: true,
          message: 'Logged out successfully'
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Error processing logout'
        });
      }
    } catch (error) {
      next(error);
    }
  }
};