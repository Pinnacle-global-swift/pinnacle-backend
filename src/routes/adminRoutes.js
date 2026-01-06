import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { adminKycController } from '../controllers/adminKycController.js';
import { adminCardController } from '../controllers/adminCardController.js';
import { adminTransactionController } from '../controllers/adminTransactionController.js';
import { adminDashboardController } from '../controllers/adminDashboardController.js';
import { adminUserRoutes } from './adminUserRoutes.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body, query } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/admin/transfer:
 *   post:
 *     summary: Admin transfer money to user account by account number
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *               - senderName
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: User's account number
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 500
 *               senderName:
 *                 type: string
 *                 description: Name of the sender
 *                 example: "Admin"
 *               description:
 *                 type: string
 *                 description: Transfer description
 *                 example: "Admin funds adjustment"
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Account not found
 */
const transferValidation = [
  body('accountNumber').notEmpty().withMessage('accountNumber is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('senderName')
    .notEmpty()
    .withMessage('Sender name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Sender name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters')
];

// Protect all admin routes
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve key metrics for the admin dashboard including user counts, transactions, and KYC status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 10000
 *                     activeUsers:
 *                       type: number
 *                       example: 7500
 *                     totalTransactions:
 *                       type: number
 *                       example: 50000
 *                     pendingKYC:
 *                       type: number
 *                       example: 250
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this route
 */
router.get(
  '/dashboard/stats',
  authenticate,
  authorize('admin'),
  adminDashboardController.getDashboardStats
);

// Admin KYC Routes
router.post(
  '/kyc/approve',
  authenticate,
  authorize('admin'),
  [
    body('kycId').isMongoId().withMessage('Valid KYC ID is required'),
    body('status').isIn(['approved', 'rejected']).withMessage('Valid status required'),
    body('remarks').optional().trim().isLength({ max: 500 })
  ],
  validate,
  adminKycController.approveKyc
);

router.get(
  '/kyc',
  authenticate,
  authorize('admin'),
  adminKycController.getAllKyc
);

// Admin Card Routes
router.get(
  '/cards',
  [
    query('status')
      .optional()
      .isIn(['pending', 'approved', 'rejected', 'active'])
      .withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  adminCardController.getAllCards
);

router.post(
  '/cards/process',
  [
    body('cardId').isMongoId().withMessage('Valid card ID is required'),
    body('status')
      .isIn(['approved', 'rejected'])
      .withMessage('Status must be either approved or rejected'),
    body('remarks').optional().trim().isLength({ max: 500 })
  ],
  validate,
  adminCardController.processCardApplication
);

// Admin Transaction Routes
router.post(
  '/transactions/process',
  [
    body('transactionId').isMongoId().withMessage('Valid transaction ID is required'),
    body('status')
      .isIn(['approved', 'rejected'])
      .withMessage('Status must be either approved or rejected'),
    body('remarks').optional().trim()
  ],
  validate,
  adminTransactionController.processTransaction
);

// Admin Transfer Route
router.post(
  '/transfer',
  authenticate,
  authorize('admin'),
  transferValidation,
  validate,
  adminController.adminTransferByAccount
);

// Admin User Routes
router.use('/users', adminUserRoutes);

// Admin Email Route
router.post(
  '/email/send',
  [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('title').optional().trim()
  ],
  validate,
  adminController.sendEmailToUser
);

export const adminRoutes = router;