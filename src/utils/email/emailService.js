import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  // Add custom headers for sender identity
  headers: {
    'X-Sender-Name': 'Pinnacle Global Swift',
    'X-Sender-Email': 'support@pinnacleglobalswift.com'
  }
});

export const emailService = {
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: {
          name: 'Pinnacle Global Swift',
          address: 'support@pinnacleglobalswift.com'
        },
        replyTo: 'support@pinnacleglobalswift.com',
        to,
        subject: template.subject,
        html: template.html
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  },

  async verifyConnection() {
    try {
      await transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
};