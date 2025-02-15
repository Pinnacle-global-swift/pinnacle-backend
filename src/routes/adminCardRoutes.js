import express from 'express';
import { adminCardController } from '../controllers/adminCardController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body, query } from 'express-validator';
import { CARD_STATUS } from '../constants/status.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/cards:
 *   get:
 *     summary: Get all card applications with optional status filter
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, active]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of card applications retrieved successfully
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  [
    query('status')
      .optional()
      .isIn(Object.values(CARD_STATUS))
      .withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  adminCardController.getAllCards
);

/**
 * @swagger
 * /api/admin/cards/process:
 *   post:
 *     summary: Process (approve/reject) a card application
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
 *               - cardId
 *               - status
 *             properties:
 *               cardId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               remarks:
 *                 type: string
 */
router.post(
  '/process',
  authenticate,
  authorize('admin'),
  [
    body('cardId').isMongoId().withMessage('Valid card ID is required'),
    body('status')
      .isIn([CARD_STATUS.APPROVED, CARD_STATUS.REJECTED])
      .withMessage('Status must be either approved or rejected'),
    body('remarks').optional().trim().isLength({ max: 500 })
  ],
  validate,
  adminCardController.processCardApplication
);

export const adminCardRoutes = router; 