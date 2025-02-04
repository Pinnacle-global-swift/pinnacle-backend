import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  }
});

export const emailService = {
  async sendEmail(to, { subject, html }) {
    try {
      const mailOptions = {
        from: config.emailFrom,
        to,
        subject,
        html
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