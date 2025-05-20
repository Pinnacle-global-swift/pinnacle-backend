import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { logger } from './logger.js';

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com', // Use your email host
  port: 587, // Port for secure SMTP
  secure: false, // Must be true for port 465
  auth: {
    user: config.emailUser, // Use environment variables for security
    pass: config.emailPassword  // Use environment variables for security
  },
  tls: {
    rejectUnauthorized: false // Only use this in development if needed
  },
  debug: true, // For development only, remove in production
  // Custom headers for Zoho Mail
  headers: {
    'X-Sender-Name': 'Pinnacle Global Swift',
    'X-Priority': '3'
  }
});

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error('SMTP server connection error:', error);
  } else {
    logger.info('SMTP server connection successful');
  }
});

export const emailService = {
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: {
          name: 'Pinnacle Global Swift',
          address: config.emailUser
        },
        replyTo: config.emailUser,
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
  }
};

// Export the sendEmail function directly for convenience
export const sendEmail = emailService.sendEmail.bind(emailService);
