import { emailService } from '../utils/email/emailService.js';
import { welcomeEmailTemplates } from '../utils/email/welcomeTemplates.js';
import { logger } from '../utils/logger.js';

class EmailNotificationService {
  async sendWelcomeEmail(user) {
    try {
      await emailService.sendEmail(
        user.email,
        welcomeEmailTemplates.newUserWelcome(
          user.fullName,
          user.uniqueId,
          user.accountType
        )
      );
      logger.info(`Welcome email sent to ${user.email}`);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendLoginAlert(user, deviceInfo) {
    try {
      const loginTime = new Date().toLocaleString();
      await emailService.sendEmail(
        user.email,
        welcomeEmailTemplates.successfulLogin(
          user.fullName,
          loginTime,
          deviceInfo
        )
      );
      logger.info(`Login alert sent to ${user.email}`);
    } catch (error) {
      logger.error('Failed to send login alert:', error);
      // Don't throw error - login should succeed even if email fails
      return false;
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
