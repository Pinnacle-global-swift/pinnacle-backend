import { Notification } from '../models/Notification.js';

export const notificationController = {
  // Get user notifications
  getUserNotifications: async (req, res, next) => {
    try {
      const notifications = await Notification.find({
        userId: req.user.id,
        isAdmin: false
      })
        .sort('-createdAt')
        .limit(20);

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark user notifications as read
  markAsRead: async (req, res, next) => {
    try {
      const { notificationIds } = req.body;

      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          userId: req.user.id
        },
        { isRead: true }
      );

      res.status(200).json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      next(error);
    }
  }
};