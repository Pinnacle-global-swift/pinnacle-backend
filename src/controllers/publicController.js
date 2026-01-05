import { CardApplication } from '../models/CardApplication.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Notification } from '../models/Notification.js';
import { emailService } from '../utils/email/emailService.js';
import { EmailTemplates } from "../utils/email/emailTemplates.js"


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
        EmailTemplates.cardApplicationReceived(name)
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
        EmailTemplates.supportTicketReceived(name, ticket._id)
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