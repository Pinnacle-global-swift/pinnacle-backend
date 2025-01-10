import bcrypt from 'bcryptjs';
import { Card } from '../models/Card.js';
import { validatePIN } from '../utils/pinValidator.js';
import { ValidationError } from '../utils/errors.js';

class CardPinService {
  async setCardPIN(userId, pin) {
    if (!validatePIN(pin)) {
      throw new ValidationError('PIN must be exactly 6 digits');
    }

    const card = await Card.findOne({ userId });
    if (!card) {
      throw new ValidationError('Card not found');
    }

    if (card.status !== 'active') {
      throw new ValidationError('Card must be active to set PIN');
    }

    if (card.pinHash) {
      throw new ValidationError('PIN already set for this card');
    }

    // Hash the PIN
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    // Update card with PIN hash and ensure it's active
    await Card.findByIdAndUpdate(card._id, { 
      pinHash,
      status: 'active'
    });

    return { message: 'Card PIN set successfully' };
  }
}

export const cardPinService = new CardPinService();