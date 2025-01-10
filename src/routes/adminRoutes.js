import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { adminKycController } from '../controllers/adminKycController.js';
import { adminCardController } from '../controllers/adminCardController.js';
import { adminTransactionController } from '../controllers/adminTransactionController.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';



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

// Transfer route
router.post('/transfer', transferValidation, validate, adminController.adminTransferByAccount);

// Existing routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/cards', adminController.getCardRequests);
router.put('/cards/:cardId/status', adminController.updateCardStatus);
router.get('/notifications', adminController.getAdminNotifications);
router.post('/notifications/mark-read', adminController.markNotificationsAsRead);



// KYC Routes
router.get(
  '/kyc/pending',
  authenticate,
  authorize('admin'),
  adminKycController.getPendingKyc
);

router.post(
  '/kyc/approve',
  authenticate,
  authorize('admin'),
  [
    body('kycId').isMongoId(),
    body('status').isIn(['approved', 'rejected']),
    body('remarks').optional().isString()
  ],
  validate,
  adminKycController.approveKyc
);

// Card Routes
router.get(
  '/cards',
  authenticate,
  authorize('admin'),
  adminCardController.getCardApplications
);

router.post(
  '/cards/process',
  authenticate,
  authorize('admin'),
  [
    body('cardId').isMongoId(),
    body('status').isIn(['active', 'rejected', "blocked"]),
    body('remarks').optional().isString()
  ],
  validate,
  adminCardController.processCardApplication
);

// Transaction Routes
router.get(
  '/transactions/pending',
  authenticate,
  authorize('admin'),
  adminTransactionController.getPendingTransactions
);

router.post(
  '/transactions/approve',
  authenticate,
  authorize('admin'),
  [
    body('transactionId').isMongoId(),
    body('status').isIn(['approved', 'rejected', 'completed', 'failed']),
    body('remarks').optional().isString()
  ],
  validate,
  adminTransactionController.approveTransaction
);


export const adminRoutes = router;