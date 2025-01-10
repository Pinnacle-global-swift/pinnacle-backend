import { Notification } from '../models/Notification.js';
import { emailService } from '../utils/email/emailService.js';
import { notificationTemplates } from '../utils/email/notificationTemplates.js';
import { logger } from '../utils/logger.js';

class NotificationService {
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  async sendTransactionAlert(user, { amount, type, balance }) {
    try {
      // Create in-app notification
      await this.createNotification({
        userId: user._id,
        title: `${type} Alert`,
        message: `${type} of ${amount} USD has been processed`,
        type: type === 'Credit' ? 'success' : 'info'
      });

      // Send email notification
      const emailTemplate = notificationTemplates.transactionAlert(
        user.fullName,
        amount,
        type,
        balance
      );

      await emailService.sendEmail(user.email, emailTemplate);
    } catch (error) {
      logger.error('Failed to send transaction alert:', error);
      throw error;
    }
  }

  async sendCardStatusUpdate(user, cardType, status) {
    try {
      // Create in-app notification
      await this.createNotification({
        userId: user._id,
        title: 'Card Application Update',
        message: `Your ${cardType} card application has been ${status}`,
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info'
      });

      // Send email notification
      const emailTemplate = notificationTemplates.cardStatusUpdate(
        user.fullName,
        cardType,
        status
      );

      await emailService.sendEmail(user.email, emailTemplate);
    } catch (error) {
      logger.error('Failed to send card status update:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();