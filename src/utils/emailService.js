import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred service
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  }
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};