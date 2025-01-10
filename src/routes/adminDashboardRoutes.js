import express from 'express';
import { adminDashboardController } from '../controllers/adminDashboardController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve key metrics for the admin dashboard including user counts, transactions, and KYC status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                     totalUsers:
 *                       type: number
 *                       example: 10000
 *                     activeUsers:
 *                       type: number
 *                       example: 7500
 *                     totalTransactions:
 *                       type: number
 *                       example: 50000
 *                     pendingKYC:
 *                       type: number
 *                       example: 250
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this route
 */
router.get(
  '/stats',
  authenticate,
  authorize('admin'),
  adminDashboardController.getDashboardStats
);

export const adminDashboardRoutes = router;