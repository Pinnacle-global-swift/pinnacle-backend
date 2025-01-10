import express from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Validation rules
const otpValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Valid 6-digit OTP is required')
  ];
  


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *               - fullName
 *               - gender
 *               - email
 *               - password
 *               - country
 *               - address
 *               - phoneNumber
 *             properties:
 *               accountType:
 *                 type: string
 *                 enum: [personal, business]
 *               fullName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid input or email already exists
 */
const registerValidation = [
    body('accountType')
        .isIn(['personal', 'business'])
        .withMessage('Invalid account type'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Invalid gender'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('country').notEmpty().withMessage('Country is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required')
];

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset email sent
 *       404:
 *         description: User not found
 */
const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required')
];

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
const resetPasswordValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

/**
 * @swagger
 * /api/auth/verify/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */


/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP for email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: Email already verified
 */
router.post('/resend-otp', 
    body('email').isEmail().withMessage('Valid email is required'),
    validate,
    authController.resendOTP
  );
  


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authorized
 */
router.post('/verify-otp', otpValidation, validate, authController.verifyOTP);
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/verify/:token', authController.verifyEmail);
// router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
// router.post('/reset-password/:token', resetPasswordValidation, validate, authController.resetPassword);
router.post('/logout', authenticate, authController.logout);



// Add these routes to the existing authRoutes.js
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 *       404:
 *         description: Account not found
 */
router.post('/forgot-password',
    body('email').isEmail().withMessage('Valid email is required'),
    validate,
    authController.forgotPassword
  );
  
  /**
   * @swagger
   * /api/auth/verify-reset-otp:
   *   post:
   *     summary: Verify password reset OTP
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - otp
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               otp:
   *                 type: string
   *     responses:
   *       200:
   *         description: OTP verified successfully
   *       400:
   *         description: Invalid or expired OTP
   */
  router.post('/verify-reset-otp',
    [
      body('email').isEmail().withMessage('Valid email is required'),
      body('otp').isLength({ min: 6, max: 6 }).isNumeric()
    ],
    validate,
    authController.verifyResetOTP
  );
  
  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Reset password with valid reset token
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       200:
   *         description: Password reset successful
   *       401:
   *         description: Invalid reset token
   */
  router.post('/reset-password',
    authenticate,
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    authController.resetPassword
  );


export const authRoutes = router;