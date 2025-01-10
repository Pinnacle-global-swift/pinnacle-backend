import express from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { transactionStatsController } from '../controllers/transactionStatsController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { query } from 'express-validator';


const router = express.Router();




/**
 * @swagger
 * /api/transactions/stats/totals:
 *   get:
 *     summary: Get user's total withdrawals and deposits
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction totals retrieved successfully
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
 *                     totalWithdrawn:
 *                       type: number
 *                     totalDeposited:
 *                       type: number
 */
router.get('/stats/totals', authenticate, transactionStatsController.getTransactionTotals);




/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [withdrawal, deposit, transfer]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
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
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           status:
 *                             type: string
 *                           reference:
 *                             type: string
 *                           description:
 *                             type: string
 *                           balanceAfter:
 *                             type: number
 *                           createdAt:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         pages:
 *                           type: number
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 */
router.get('/history',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isIn(['withdrawal', 'deposit', 'transfer']),
    query('startDate').optional().isDate(),
    query('endDate').optional().isDate()
  ],
  validate,
  transactionController.getUserTransactions
);

/**
 * @swagger
 * /api/transactions/admin/all:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Admin, Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [withdrawal, deposit, transfer]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [processing, completed, failed]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           userDetails:
 *                             type: object
 *                             properties:
 *                               fullName:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           type:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           status:
 *                             type: string
 *                           reference:
 *                             type: string
 *                           description:
 *                             type: string
 *                           metadata:
 *                             type: object
 *                           createdAt:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         pages:
 *                           type: number
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 */
router.get('/admin/all',
  authenticate,
  authorize('admin'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isIn(['withdrawal', 'deposit', 'transfer']),
    query('userId').optional().isMongoId(),
    query('status').optional().isIn(['processing', 'completed', 'failed']),
    query('startDate').optional().isDate(),
    query('endDate').optional().isDate()
  ],
  validate,
  transactionController.getAllTransactions
);

export const transactionRoutes = router;