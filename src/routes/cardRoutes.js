import express from 'express';
import { cardController } from '../controllers/cardController.js';
import { cardPinController } from '../controllers/cardPinController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management endpoints
 */

/**
 * @swagger
 * /api/cards/apply:
 *   post:
 *     summary: Apply for a new card
 *     description: Submit an application for a new Mastercard. Card will be pending until payment is processed.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [mastercard]
 *                 default: mastercard
 *                 description: Type of card to apply for
 *     responses:
 *       201:
 *         description: Card application submitted successfully
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
 *                     id:
 *                       type: string
 *                       description: Card ID
 *                       example: "507f1f77bcf86cd799439011"
 *                     type:
 *                       type: string
 *                       example: "mastercard"
 *                     status:
 *                       type: string
 *                       enum: [pending, active, blocked, expired]
 *                       example: "pending"
 *                     paymentStatus:
 *                       type: string
 *                       enum: [pending, processing, paid, failed]
 *                       example: "pending"
 *                     paymentAmount:
 *                       type: number
 *                       description: Required payment amount for card activation
 *                       example: 25
 *                     limit:
 *                       type: number
 *                       description: Card spending limit
 *                       example: 10000
 *       400:
 *         description: Invalid request or existing card application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "You already have a card application"
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cards/payment:
 *   post:
 *     summary: Process card payment
 *     description: Process the payment for card activation
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - transactionId
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used
 *                 example: "credit_card"
 *               transactionId:
 *                 type: string
 *                 description: Payment transaction ID
 *                 example: "tx_123456789"
 *     responses:
 *       200:
 *         description: Payment processed successfully
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
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     paymentStatus:
 *                       type: string
 *                       example: "paid"
 *                     activationDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid payment details or payment failed
 *       404:
 *         description: No pending card application found
 */

/**
 * @swagger
 * /api/cards/status:
 *   get:
 *     summary: Get card status
 *     description: Retrieve the current status of user's card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Card status retrieved successfully
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
 *                     hasCard:
 *                       type: boolean
 *                       example: true
 *                     cardDetails:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "mastercard"
 *                         status:
 *                           type: string
 *                           example: "active"
 *                         paymentStatus:
 *                           type: string
 *                           example: "paid"
 *                         cardNumber:
 *                           type: string
 *                           example: "****-****-****-1234"
 *                         expiryMonth:
 *                           type: string
 *                           example: "12"
 *                         expiryYear:
 *                           type: string
 *                           example: "27"
 *                         limit:
 *                           type: number
 *                           example: 10000
 *       401:
 *         description: Not authenticated
 */

const cardApplicationValidation = [
  body('type')
    .optional()
    .isIn(['mastercard'])
    .withMessage('Invalid card type')
];

const paymentValidation = [
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required'),
  body('transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required')
];

router.post('/apply', authenticate, cardApplicationValidation, validate, cardController.applyCard);
router.post('/payment', authenticate, paymentValidation, validate, cardController.processPayment);
router.get('/status', authenticate, cardController.getCardStatus);

const pinValidation = [
  body('pin')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('PIN must be exactly 6 digits')
];

router.post('/set', authenticate, pinValidation, validate, cardPinController.setPin);

export const cardPinRoutes = router;


export const cardRoutes = router;