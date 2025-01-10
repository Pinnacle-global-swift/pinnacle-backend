import { cardService } from '../services/cardService.js';
import { emailService } from '../utils/email/emailService.js';

export const cardController = {
  async applyCard(req, res, next) {
    try {
      const { type } = req.body;
      const card = await cardService.applyForCard(req.user.id, type);

      // Send email notification
      await emailService.sendEmail(req.user.email, {
        subject: 'Card Application Received',
        html: `Your ${type} card application has been received. ${
          card.paymentAmount > 0 
            ? 'Please complete the payment to activate your card.' 
            : 'Your card will be activated shortly.'
        }`
      });

      res.status(201).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  },

  async processPayment(req, res, next) {
    try {
      const { paymentMethod, transactionId } = req.body;
      const card = await cardService.processPayment(
        req.user.id,
        paymentMethod,
        transactionId
      );

      // Send email notification
      await emailService.sendEmail(req.user.email, {
        subject: 'Card Payment Processed',
        html: `Your card payment has been processed successfully. Your card is now active.`
      });

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  },

  async getCardStatus(req, res, next) {
    try {
      const status = await cardService.getCardStatus(req.user.id);
      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
};