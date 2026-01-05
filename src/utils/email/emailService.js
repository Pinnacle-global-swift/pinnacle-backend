import { MailtrapClient } from 'mailtrap';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const client = config.mailtrapToken ? new MailtrapClient({
  token: config.mailtrapToken,
}) : null;

const sender = {
  email: config.mailtrapSenderEmail,
  name: config.mailtrapSenderName || 'Pinnacle Global Swift',
};

export const emailService = {
  async sendEmail(to, template) {
    if (!client) {
      logger.error('Mailtrap client not initialized: MAILTRAP_TOKEN is missing');
      return { success: false, error: 'Email service misconfigured' };
    }

    if (!to || !template || !template.subject || !template.html) {
      logger.error('Invalid email parameters:', { to, template });
      throw new Error('Missing required email parameters');
    }

    try {
      const recipients = [{ email: to }];

      logger.info(`Attempting to send email to: ${to} | Subject: ${template.subject}`);

      const response = await client.send({
        from: sender,
        to: recipients,
        subject: template.subject,
        html: template.html,
        category: template.category || "Notification",
      });

      logger.info(`Email sent successfully via Mailtrap to ${to}. ID: ${response.message_ids[0]}`);
      return { success: true, ...response };
    } catch (error) {
      logger.error(`Failed to send email to ${to} via Mailtrap:`, error);
      throw error;
    }
  }
};