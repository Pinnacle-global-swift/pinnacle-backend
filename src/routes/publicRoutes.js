import express from 'express';
import { publicController } from '../controllers/publicController.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/public/card-application:
 *   post:
 *     summary: Apply for a card (non-authenticated)
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - cardType
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cardType:
 *                 type: string
 *                 enum: [virtual_debit, premium_credit]
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/public/support:
 *   post:
 *     summary: Submit a support ticket
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support ticket submitted successfully
 *       400:
 *         description: Invalid input
 */

const cardApplicationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('cardType')
    .isIn(['virtual_debit', 'premium_credit'])
    .withMessage('Invalid card type')
];

const supportTicketValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

router.post('/card-application', cardApplicationValidation, validate, publicController.applyForCard);
router.post('/support', supportTicketValidation, validate, publicController.submitSupport);

export const publicRoutes = router;