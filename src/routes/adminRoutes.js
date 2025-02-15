import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { adminKycController } from '../controllers/adminKycController.js';
import { adminCardController } from '../controllers/adminCardController.js';
import { adminTransactionController } from '../controllers/adminTransactionController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body, query } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/admin/transfer:
 *   post:
 *     summary: Admin transfer money to user account
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
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User's ID
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *               description:
 *                 type: string
 *                 description: Transfer description
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
const transferValidation = [
  body('accountNumber').notEmpty().withMessage('accountNumber is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description').optional().isString()
];

// Protect all admin routes
router.use(authenticate, authorize('admin'));

// Admin Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Admin KYC Routes
router.get('/kyc', adminKycController.getAllKyc);

router.post(
  '/kyc/process',
  [
    body('kycId').isMongoId().withMessage('Valid KYC ID is required'),
    body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
    body('remarks').optional().trim()
  ],
  validate,
  adminKycController.processKyc
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

export const adminRoutes = router;