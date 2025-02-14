import { Card } from '../models/Card.js';
import { CARD_STATUS } from '../constants/status.js';
import { emailService } from '../utils/email/emailService.js';
import { ValidationError } from '../utils/errors.js';
import { EmailTemplates } from '../utils/email/emailTemplates.js';

export const adminCardController = {
  async getCardApplications(req, res, next) {
    try {
      const { status } = req.query;
      
      // Build match condition based on status filter
      const matchCondition = status ? { status } : {};

      const cardApplications = await Card.aggregate([
        {
          $match: matchCondition
        },
        {
          $lookup: {
            from: 'pinnacleusers',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            type: 1,
            status: 1,
            paymentStatus: 1,
            paymentAmount: 1,
            limit: 1,
            maskedCardNumber: 1,
            submittedAt: '$createdAt',
            'user.fullName': 1,
            'user.email': 1,
            rejectionReason: 1,
            remarks: 1
          }
        },
        {
          $sort: { submittedAt: -1 }
        }
      ]);

      const stats = {
        total: cardApplications.length,
        pending: cardApplications.filter(app => app.status === CARD_STATUS.PENDING).length,
        approved: cardApplications.filter(app => app.status === CARD_STATUS.APPROVED).length,
        rejected: cardApplications.filter(app => app.status === CARD_STATUS.REJECTED).length,
        active: cardApplications.filter(app => app.status === CARD_STATUS.ACTIVE).length
      };

      res.status(200).json({
        success: true,
        data: {
          applications: cardApplications,
          statistics: stats
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async processCardApplication(req, res, next) {
    try {
      const { cardId, status, remarks } = req.body;
      console.log('Request body:', { cardId, status, remarks });

      if (!cardId || !status) {
        throw new ValidationError('Card ID and status are required');
      }

      // Simplified status validation
      if (!['approved', 'rejected'].includes(status.toLowerCase())) {
        throw new ValidationError('Status must be either approved or rejected');
      }

      const card = await Card.findById(cardId).populate('userId', 'email fullName');
      if (!card) {
        throw new ValidationError('Card application not found');
      }

      if (card.status !== CARD_STATUS.PENDING) {
        throw new ValidationError('Can only process pending applications');
      }

      // Update card status
      card.status = status.toLowerCase();
      card.remarks = remarks;
      card.processedAt = new Date();
      card.processedBy = req.user.id;

      await card.save();

      // Send email notification using the template
      await emailService.sendEmail(
        card.userId.email,
        EmailTemplates.cardApplicationStatus(status.toLowerCase(), card.type, remarks)
      );

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      console.error('Error processing card application:', error);
      next(error);
    }
  }
};