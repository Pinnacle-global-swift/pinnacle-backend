import { Card } from '../models/Card.js';
import { User } from '../models/User.js';
import { CARD_STATUS } from '../constants/status.js';
import { emailService } from '../utils/email/emailService.js';
import { ValidationError } from '../utils/errors.js';
import { EmailTemplates } from '../utils/email/emailTemplates.js';

export const adminCardController = {
  async getAllCards(req, res, next) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = {};
      if (status) {
        query.status = status;
      }

      // Get cards with pagination
      const cards = await Card.find(query)
        .populate('userId', 'email fullName uniqueId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const totalCount = await Card.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          cards,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async processCardApplication(req, res, next) {
    try {
      const { cardId, status, remarks } = req.body;

      const card = await Card.findById(cardId).populate('userId', 'email fullName');
      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Card application not found'
        });
      }

      // Update card status
      card.status = status;
      if (remarks) {
        card.remarks = remarks;
      }

      if (status === CARD_STATUS.APPROVED) {
        card.activationDate = new Date();
      } else if (status === CARD_STATUS.REJECTED) {
        card.rejectionReason = remarks || 'Application rejected by admin';
      }

      await card.save();

      // Send email notification
      if (card.userId && card.userId.email) {
        const emailTemplate = EmailTemplates.cardApplicationStatus(
          card.userId.fullName,
          status,
          card.type,
          remarks
        );
        await emailService.sendEmail(card.userId.email, emailTemplate);
      }

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  }
};