import { Card } from '../models/Card.js';
import { ValidationError } from '../utils/errors.js';
import { CARD_STATUS } from '../constants/status.js';
import { emailService } from '../utils/email/emailService.js';
import { EmailTemplates } from '../utils/email/emailTemplates.js';

// Helper function to generate card details
const generateCardDetails = () => {
  // Generate a random 16-digit card number
  const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Generate CVV (3 digits)
  const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Set expiry date (4 years from now)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 4);
  
  return {
    cardNumber,
    cvv,
    expiryMonth: String(expiryDate.getMonth() + 1).padStart(2, '0'),
    expiryYear: String(expiryDate.getFullYear()),
    maskedCardNumber: `****-****-****-${cardNumber.slice(-4)}`
  };
};

// Card type configurations
const CARD_CONFIGS = {
  virtual: {
    limit: 5000,
    paymentAmount: 0
  },
  physical: {
    limit: 10000,
    paymentAmount: 25
  },
  premium: {
    limit: 50000,
    paymentAmount: 100
  },
  mastercard: {
    limit: 50000,
    paymentAmount: 100
  }
};

export const cardService = {
  async applyForCard(userId, type, receiptUrl) {
    // Check for existing card applications
    const existingCard = await Card.findOne({ 
      userId,
      status: { $nin: [CARD_STATUS.REJECTED] } // Exclude rejected cards
    });
    
    // If there's an existing card application that was rejected, allow reapplication
    if (existingCard && existingCard.status === CARD_STATUS.REJECTED) {
      existingCard.status = CARD_STATUS.PENDING; // Reset status to pending
      existingCard.receiptUrl = receiptUrl; // Update receipt URL if necessary
      await existingCard.save();
      return existingCard; // Return the updated card application
    }

    // Validate new card type
    if (!CARD_CONFIGS[type]) {
      throw new ValidationError('Invalid card type. Must be virtual, physical, or premium');
    }

    const config = CARD_CONFIGS[type];
    const cardDetails = generateCardDetails();

    // Create new card with all required fields
    return await Card.create({
      userId,
      type,
      status: CARD_STATUS.PENDING,
      cardNumber: cardDetails.cardNumber,
      maskedCardNumber: cardDetails.maskedCardNumber,
      cvv: cardDetails.cvv,
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
      limit: config.limit, // Set the limit based on card type
      paymentAmount: config.paymentAmount,
      paymentReceipt: receiptUrl
    });
  },

  async reapplyCard(userId, type, receiptUrl) {
    const card = await Card.findOne({ userId });
    if (!card) {
      throw new ValidationError('No previous card application found');
    }

    if (card.status !== CARD_STATUS.REJECTED) {
      throw new ValidationError('Can only reapply for rejected cards');
    }

    // Validate new card type
    if (!CARD_CONFIGS[type]) {
      throw new ValidationError('Invalid card type. Must be virtual, physical, or premium');
    }

    const config = CARD_CONFIGS[type];
    const cardDetails = generateCardDetails();

    // Update card with new details
    card.status = CARD_STATUS.PENDING;
    card.type = type;
    card.cardNumber = cardDetails.cardNumber;
    card.maskedCardNumber = cardDetails.maskedCardNumber;
    card.cvv = cardDetails.cvv;
    card.expiryMonth = cardDetails.expiryMonth;
    card.expiryYear = cardDetails.expiryYear;
    card.limit = config.limit;
    card.paymentAmount = config.paymentAmount;
    card.paymentReceipt = receiptUrl;
    card.reappliedAt = new Date();
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
  },

  async scheduleCardRejection(card) {
    const rejectionTime = new Date(card.createdAt);
    rejectionTime.setDate(rejectionTime.getDate() + 2); // Set to 2 days later

    // Use setTimeout to schedule the rejection
    setTimeout(async () => {
      try {
        const updatedCard = await Card.findById(card._id).populate('userId', 'email fullName');
        if (updatedCard && updatedCard.status === CARD_STATUS.PENDING) {
          updatedCard.status = CARD_STATUS.REJECTED;
          await updatedCard.save();

          // Send email notification
          if (updatedCard.userId?.email) {
            await emailService.sendEmail(updatedCard.userId.email,
              EmailTemplates.cardApplicationStatus(
                updatedCard.userId.fullName,
                'rejected',
                updatedCard.type,
                'Your application has been automatically rejected after 2 days.'
              ));
          }
        }
      } catch (error) {
        console.error('Scheduled card rejection failed:', error);
      }
    }, rejectionTime - new Date());
  },
};