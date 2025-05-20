import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';
import { logger } from '../logger.js';

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: false, // Important: set to false for port 587
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  },
  tls: {
    // Required for some hosts
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true // Enable debug logs
});

// Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP server is ready to take messages');
  }
});

export const emailService = {
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: config.emailFrom,
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
      logger.info('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }
};