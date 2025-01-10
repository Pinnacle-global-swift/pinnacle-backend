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
router.post(
  '/approve',
  authenticate,
  authorize('admin'),
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

export const adminKycRoutes = router;