import express from 'express';
import { accountController } from '../controllers/accountController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @swagger
 * /api/account/info:
 *   get:
 *     summary: Get user account information
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account information retrieved successfully
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
 *                     accountNumber:
 *                       type: string
 *                     balance:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Account not found
 */
router.get('/info', authenticate, accountController.getAccountInfo);

export const accountRoutes = router;