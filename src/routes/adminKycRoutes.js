import express from 'express';
import { adminKycController } from '../controllers/adminKycController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';
import { KYC_STATUS } from '../constants/status.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/kyc/approve:
 *   post:
 *     summary: Approve or reject KYC application
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
 *               - kycId
 *               - status
 *             properties:
 *               kycId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC application processed successfully
 *       400:
 *         description: Invalid request or KYC already processed
 *       404:
 *         description: KYC application not found
 */
router.use(authenticate, authorize('admin'));

router.post(
  '/approve',
  [
    body('kycId').isMongoId().withMessage('Valid KYC ID is required'),
    body('status')
      .isIn([KYC_STATUS.APPROVED, KYC_STATUS.REJECTED])
      .withMessage('Valid status required'),
    body('remarks').optional().trim().isLength({ max: 500 })
  ],
  validate,
  adminKycController.approveKyc
);

/**
 * @swagger
 * /api/admin/kyc/reject:
 *   post:
 *     summary: Reject a KYC application and notify the user
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
 *               - kycId
 *             properties:
 *               kycId:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC application rejected successfully
 *       400:
 *         description: Invalid request or KYC not found
 *       404:
 *         description: KYC application not found
 */
router.post(
  '/reject',
  [
    body('kycId').isMongoId().withMessage('Valid KYC ID is required'),
    body('remarks').optional().trim()
  ],
  validate,
  adminKycController.rejectKyc
);

/**
 * @swagger
 * /api/admin/kyc:
 *   get:
 *     summary: Get all KYC applications with optional status filter
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [processing, approved, rejected, additional_info_required]
 *         description: Filter applications by status
 *     responses:
 *       200:
 *         description: List of KYC applications retrieved successfully
 */
router.get(
  '/',
  adminKycController.getAllKyc
);

export const adminKycRoutes = router;

