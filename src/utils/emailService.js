import nodemailer from 'nodemailer';
import { config } from '../config/config.js'; // Ensure config.js handles your environment variables

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com", // Use your email host
  port: 465, // Port for secure SMTP
  secure: true, // Must be true for port 465
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASS  // Use environment variables for security
  },
  logger: true, // Enable logging for debugging purposes
  debug: true, // Enable debug output
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`, // Set a proper sender name
      to,
      subject,
      text,
    });
    console.log('Message sent: %s', info.messageId); // Log message ID
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};
