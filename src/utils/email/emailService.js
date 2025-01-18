import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.privateemail.com", // Use your email host
      port: 465, // Port for secure SMTP
      secure: true, 
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
  }

  async sendEmail(to, { subject, html }) {
    try {
      const mailOptions = {
        from: config.emailFrom,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();