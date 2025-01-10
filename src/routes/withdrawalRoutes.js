import express from 'express';
import { withdrawalController } from '../controllers/withdrawalController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 *
 * @swagger
 * tags:
 *   name: Withdrawals
 *   description: Withdrawal management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WithdrawalRequest:
 *       type: object
 *       required:
 *         - amount
 *         - withdrawalMethod
 *         - accountNumber
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Amount to withdraw
 *           example: 1000.00
 *         withdrawalMethod:
 *           type: string
 *           enum: [Bank Transfer, Wire Transfer, Cryptocurrency]
 *           description: Method of withdrawal
 *           example: Bank Transfer
 *         accountNumber:
 *           type: string
 *           description: Recipient account number
 *           example: "1234567890"
 *         swiftCode:
 *           type: string
 *           description: SWIFT code (required for Wire Transfer)
 *           example: "BOFAUS3N"
 *     WithdrawalResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             transaction:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 type:
 *                   type: string
 *                   example: "withdrawal"
 *                 amount:
 *                   type: number
 *                   example: 1000.00
 *                 status:
 *                   type: string
 *                   example: "processing"
 *                 reference:
 *                   type: string
 *                   example: "TXN202401201234567"
 *                 balanceAfter:
 *                   type: number
 *                   example: 49000.00
 *             receipt:
 *               type: string
 *               description: HTML formatted receipt
 */

/**
 * @swagger
 * /api/withdrawals:
 *   post:
 *     summary: Process a withdrawal request
 *     description: |
 *       Submit a withdrawal request. Requires:
 *       - Authenticated user
 *       - Approved KYC verification
 *       - Active card
 *       - Sufficient balance
 *     tags: [Withdrawals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawalRequest'
 *     responses:
 *       200:
 *         description: Withdrawal processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WithdrawalResponse'
 *       400:
 *         description: Invalid request or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Insufficient balance"
 *                     code:
 *                       type: number
 *                       example: 400
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: KYC verification or active card required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "KYC verification required for withdrawals"
 *                     code:
 *                       type: number
 *                       example: 403
 *       500:
 *         description: Server error
 */


const withdrawalValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('withdrawalMethod')
    .isIn(['Bank Transfer', 'Wire Transfer', 'Cryptocurrency'])
    .withMessage('Invalid withdrawal method'),
  body('accountNumber')
    .notEmpty()
    .withMessage('Account number is required'),
  body('swiftCode')
    .if(body('withdrawalMethod').equals('Wire Transfer'))
    .notEmpty()
    .withMessage('SWIFT code is required for wire transfers')
];

router.post('/', authenticate, withdrawalValidation, validate, withdrawalController.withdraw);

export const withdrawalRoutes = router;