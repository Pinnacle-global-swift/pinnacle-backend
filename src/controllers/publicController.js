import { CardApplication } from '../models/CardApplication.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Notification } from '../models/Notification.js';
import { emailService } from '../utils/emailService.js';
import {EmailTemplates } from "../utils/email/emailTemplates.js"


export const publicController = {
  // Apply for card (non-authenticated)
  applyForCard: async (req, res, next) => {
    try {
      const { name, email, cardType } = req.body;

      const application = await CardApplication.create({
        name,
        email,
        cardType
      });

      // Create admin notification
      await Notification.create({
        title: 'New Card Application',
        message: `New card application received from ${name}`,
        type: 'info',
        isAdmin: true
      });

      // Send confirmation email
      await emailService.sendEmail(
        email,
        'Card Application Received',
        `Dear ${name},\n\nYour card application has been received and is being processed. We will contact you shortly.\n\nBest regards,\nFINEbank.IO Team`
      );

      res.status(201).json({
        success: true,
        data: {
          message: 'Application submitted successfully',
          applicationId: application._id
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Submit support ticket
  submitSupport: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, subject, message } = req.body;

      const ticket = await SupportTicket.create({
        name,
        email,
        phoneNumber,
        subject,
        message
      });

      // Create admin notification
      await Notification.create({
        title: 'New Support Ticket',
        message: `New support ticket received from ${name}: ${subject}`,
        type: 'info',
        isAdmin: true
      });

      // Send confirmation email
      await emailService.sendEmail(
        email,
        'Support Ticket Received',
        `Dear ${name},\n\nYour support ticket has been received. Our team will get back to you shortly.\n\nTicket ID: ${ticket._id}\n\nBest regards,\nFINEbank.IO Support Team`
      );

      res.status(201).json({
        success: true,
        data: {
          message: 'Support ticket submitted successfully',
          ticketId: ticket._id
        }
      });
    } catch (error) {
      next(error);
    }
  }
};