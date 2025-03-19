import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@pinnacleglobalswift.site",
    pass: "support@pinnacleglobalswift.site"
  }
});

export const emailService = {
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: "support@pinnacleglobalswift.site",
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