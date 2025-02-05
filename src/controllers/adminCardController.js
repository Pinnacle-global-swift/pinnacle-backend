import { Card } from '../models/Card.js';
import { User } from '../models/User.js';
import { emailService } from '../utils/email/emailService.js';
import {EmailTemplates } from "../utils/email/emailTemplates.js"

export const adminCardController = {
  async getCardApplications(req, res, next) {
    console.log("......", res)
    try {
      const cardApplications = await Card.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $project: {
            'user.fullName': 1,
            cardType: '$type',
            status: 1,
            appliedAt: '$createdAt'
          }
        }
      ]);

console.log(cardApplications)

      const stats = {
        pending: cardApplications.filter(app => app.status === 'pending').length,
        processing: cardApplications.filter(app => app.status === 'processing').length,
        approved: cardApplications.filter(app => app.status === 'approved').length,
        rejected: cardApplications.filter(app => app.status === 'rejected').length
      };

      res.status(200).json({
        success: true,
        data: { applications: cardApplications, stats }
      });
    } catch (error) {
      next(error);
    }
  },

  async processCardApplication(req, res, next) {
    try {
      const { cardId, status, remarks } = req.body;

      const card = await Card.findById(cardId);
      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Card application not found'
        });
      }

      card.status = status;
      card.remarks = remarks;
      await card.save();

      // Send email notification
      const user = await User.findById(card.userId);
      // await EmailTemplates.cardApplicationStatus()
      await emailService.sendEmail(
        user.email,
        EmailTemplates.cardApplicationStatus(status, remarks || "")
      );
     

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  }
};