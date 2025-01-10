import express from 'express';
import { verificationController } from '../controllers/verificationController.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/verification/status:
 *   post:
 *     summary: Check account verification status
 *     tags: [Verification]
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
 *         description: Verification status retrieved successfully
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
 *                     isVerified:
 *                       type: boolean
 *                     email:
 *                       type: string
 *                     verificationAttempts:
 *                       type: number
 *       404:
 *         description: User not found
 */
router.post('/status',
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
  verificationController.checkVerificationStatus
);

/**
 * @swagger
 * /api/verification/resend:
 *   post:
 *     summary: Resend verification code
 *     tags: [Verification]
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
 *         description: Verification code resent successfully
 *       400:
 *         description: Account already verified
 *       429:
 *         description: Too many verification attempts
 */
router.post('/resend',
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
  verificationController.resendVerification
);

export const verificationRoutes = router;