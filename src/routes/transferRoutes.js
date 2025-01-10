import express from 'express';
import { transferController } from '../controllers/transferController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transfer money to another account
 *     tags: [Transfer]
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
 *               - beneficiaryName
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: 10-digit account number (starts with 123)
 *                 example: "1234567890"
 *               beneficiaryName:
 *                 type: string
 *                 description: Name of the recipient
 *                 example: "John Doe"
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 1000
 *               description:
 *                 type: string
 *                 description: Optional transfer description
 *                 example: "Rent payment"
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input or insufficient balance
 *       404:
 *         description: Recipient account not found
 */
const transferValidation = [
  body('accountNumber')
    .matches(/^123\d{7}$/)
    .withMessage('Invalid account number format'),
  body('beneficiaryName')
    .trim()
    .notEmpty()
    .withMessage('Beneficiary name is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters')
];

router.post('/', authenticate, transferValidation, validate, transferController.transfer);

export const transferRoutes = router;