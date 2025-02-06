import express from 'express';
import { adminCardController } from '../controllers/adminCardController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';
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
 *     responses:
 *       200:
 *         description: List of card applications retrieved successfully
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  adminCardController.getCardApplications
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
      .custom(value => {
        const normalizedStatus = value.toLowerCase();
        const validStatuses = [CARD_STATUS.APPROVED, CARD_STATUS.REJECTED].map(s => s.toLowerCase());
        if (!validStatuses.includes(normalizedStatus)) {
          throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
        }
        return true;
      }),
    body('remarks').optional().trim().isLength({ max: 500 })
  ],
  validate,
  adminCardController.processCardApplication
);

export const adminCardRoutes = router; 