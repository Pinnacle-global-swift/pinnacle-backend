import express from 'express';
import { adminUserController } from '../controllers/adminUserController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with their status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       kycStatus:
 *                         type: string
 *                       accountStatus:
 *                         type: string
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  adminUserController.getUsersList
);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   get:
 *     summary: Get detailed user information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *                     user:
 *                       type: object
 *                     kyc:
 *                       type: object
 *                     card:
 *                       type: object
 *                     account:
 *                       type: object
 */
router.get(
  '/:userId',
  authenticate,
  authorize('admin'),
  adminUserController.getUserDetails
);

export const adminUserRoutes = router;