import { Card } from '../models/Card.js';
import { ValidationError } from '../utils/errors.js';
import { CardGenerator } from '../utils/cardGenerator.js';
import { cardValidator } from '../validators/cardValidator.js';
import { CARD_TYPES, CARD_LIMITS } from '../constants/cardConstants.js';
import { CARD_STATUS } from '../constants/status.js';

export const cardService = {
  // async applyForCard(userId, type = CARD_TYPES.MASTERCARD) {
  //       // Check for existing card
  //       const existingCard = await Card.findOne({ userId });
  //       if (existingCard) {
  //         throw new ValidationError('You already have a card application');
  //       }
    
  // // Validate all requirements
  // await cardValidator.validateAll(userId);

  //       // Generate card details
  //       const cardDetails = CardGenerator.generateCardDetails();
        
  //       // Set limits based on card type



  //       const limits = CARD_LIMITS[type];
  //       if (!limits) {
  //         throw new ValidationError('Invalid card type');
  //       }
    
  //       // Create initial card with pending status
  //       return await Card.create({
  //         userId,
  //         type,
  //         cardNumber: cardDetails.number,
  //         cvv: cardDetails.cvv,
  //         expiryMonth: cardDetails.expiryMonth,
  //         expiryYear: cardDetails.expiryYear,
  //         limit: limits.limit,
  //         paymentAmount: limits.paymentAmount,
  //         status: 'processing',
  //         paymentStatus: 'pending'
  //       });
  //     },

  async applyForCard(userId, type) {
    const existingCard = await Card.findOne({ 
      userId,
      status: { $nin: [CARD_STATUS.REJECTED] } // Allow reapply if previous was rejected
    });
    
    if (existingCard) {
      throw new Error('Card application already exists');
    }

    return await Card.create({
      userId,
      type,
      status: CARD_STATUS.PENDING
    });
  },

  async reapplyCard(userId, type) {
    const card = await Card.findOne({ userId });
    if (!card) {
      throw new Error('No previous card application found');
    }

    if (card.status !== CARD_STATUS.REJECTED) {
      throw new Error('Can only reapply for rejected cards');
    }

    // Reset card status and update type if changed
    card.status = CARD_STATUS.PENDING;
    card.type = type;
    card.reappliedAt = new Date();
    
    // Clear any previous rejection reasons
    card.rejectionReason = null;
    
    await card.save();
    return card;
  },

  async processPayment(userId, paymentMethod, transactionId) {
    const card = await Card.findOne({ userId });
    if (!card) {
      throw new ValidationError('No card application found');
    }

    if (card.paymentStatus === 'paid') {
      throw new ValidationError('Card payment already processed');
    }

    // Update payment status to processing
    card.paymentStatus = 'processing';
    await card.save();

    try {
      // Simulate payment processing
      // In production, integrate with actual payment provider
      const paymentSuccessful = true; // Replace with actual payment processing

      if (paymentSuccessful) {
        // Update card status on successful payment
        card.paymentStatus = 'paid';
        card.paymentMethod = paymentMethod;
        card.transactionId = transactionId;
        card.paymentDate = new Date();
        card.status = 'active';
        card.activationDate = new Date();
        card.expiryDate = new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000); // 4 years
        
        await card.save();
        return card;
      } else {
        // Update status if payment fails
        card.paymentStatus = 'failed';
        await card.save();
        throw new ValidationError('Payment processing failed');
      }
    } catch (error) {
      // Revert to pending status on error
      card.paymentStatus = 'pending';
      await card.save();
      throw error;
    }
  },

  // async getCardStatus(userId) {
  //   const card = await Card.findOne({ userId });
  //   return {
  //     hasCard: !!card,
  //     cardDetails: card
  //   };
  // }

  async getCardStatus(userId) {
    const card = await Card.findOne({ userId })
      .select('+pinHash'); // Include pinHash field for checking PIN status

    if (!card) {
      return {
        hasCard: false,
        cardDetails: null
      };
    }

    // Format full card number with dashes
    const formattedCardNumber = card.cardNumber.replace(/(\d{4})/g, '$1-').slice(0, -1);

    return {
      hasCard: true,
      cardDetails: {
        type: card.type,
        status: card.status,
        paymentStatus: card.paymentStatus,
        cardNumber: formattedCardNumber, // Full card number with formatting
        maskedCardNumber: card.maskedCardNumber, // Masked version for display
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        limit: card.limit,
        hasPIN: !!card.pinHash
      }
    };
  }
};