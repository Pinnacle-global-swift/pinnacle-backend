import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: false, // Set to false for Mailtrap
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
  debug: true,
  logger: true // Enable detailed logging
});

export const emailService = {
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: {
          name: 'Pinnacle Global Swift',
          address: config.emailFrom
        },
        to,
        subject: template.subject,
        html: template.html,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info('Email details:', {
        messageId: info.messageId,
        recipient: to,
        subject: template.subject,
        preview: info.preview // Mailtrap preview URL
      });
      return info;
    } catch (error) {
      logger.error('Email sending error:', {
        error: error.message,
        stack: error.stack,
        recipient: to
      });
      throw error;
    }
  },

  async verifyConnection() {
    try {
      const result = await transporter.verify();
      logger.info('Email service verification result:', result);
      return result;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      return false;
    }
  }
};