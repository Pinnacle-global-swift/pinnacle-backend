import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/users/language:
 *   put:
 *     summary: Update language preference
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [English, Spanish, French, German, Italian]
 *     responses:
 *       200:
 *         description: Language preference updated successfully
 */

/**
 * @swagger
 * /api/users/transaction-limits:
 *   put:
 *     summary: Update transaction limits
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyTransfer:
 *                 type: number
 *               dailyWithdrawal:
 *                 type: number
 *               cardSpending:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction limits updated successfully
 */

/**
 * @swagger
 * /api/users/settings:
 *   get:
 *     summary: Get user settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *       404:
 *         description: Settings not found
 */

const profileUpdateValidation = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('phoneNumber').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty')
];

const languageValidation = [
  body('language')
    .isIn(['English', 'Spanish', 'French', 'German', 'Italian'])
    .withMessage('Invalid language selection')
];

const transactionLimitsValidation = [
  body('dailyTransfer')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 5000 })
    .withMessage('Daily transfer limit must be between 0 and 5000'),
  body('dailyWithdrawal')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Daily withdrawal limit must be between 0 and 2000'),
  body('cardSpending')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Card spending limit must be between 0 and 10000')
];


// Add this route to the existing userRoutes
/**
 * @swagger
 * /api/users/details:
 *   get:
 *     summary: Get detailed user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         uniqueId:
 *                           type: string
 *                         isVerified:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                     account:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                         balance:
 *                           type: number
 *                         currency:
 *                           type: string
 *                         status:
 *                           type: string
 *                     card:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         status:
 *                           type: string
 *                         limit:
 *                           type: number
 *                         expiryDate:
 *                           type: string
 *                     settings:
 *                       type: object
 *                       properties:
 *                         language:
 *                           type: string
 *                         transactionLimits:
 *                           type: object
 *       404:
 *         description: User not found
 */
router.get('/details', authenticate, userController.getUserDetails);



router.put('/profile', authenticate, profileUpdateValidation, validate, userController.updateProfile);
router.put('/language', authenticate, languageValidation, validate, userController.updateLanguage);
router.put('/transaction-limits', authenticate, transactionLimitsValidation, validate, userController.updateTransactionLimits);
router.get('/settings', authenticate, userController.getSettings);

export const userRoutes = router;