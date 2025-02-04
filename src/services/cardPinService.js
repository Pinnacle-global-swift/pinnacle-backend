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

  async verifyPIN(userId, pin) {
    if (!validatePIN(pin)) {
      throw new ValidationError('Invalid PIN format');
    }

    const card = await Card.findOne({ userId }).select('+pinHash');
    if (!card) {
      throw new ValidationError('Card not found');
    }

    if (!card.pinHash) {
      throw new ValidationError('PIN not set for this card');
    }

    const isValid = await bcrypt.compare(pin, card.pinHash);
    if (!isValid) {
      throw new ValidationError('Invalid PIN');
    }

    return true;
  }

  async changeCardPIN(userId, currentPin, newPin) {
    if (!validatePIN(newPin)) {
      throw new ValidationError('New PIN must be exactly 6 digits');
    }

    // Verify current PIN first
    await this.verifyPIN(userId, currentPin);

    const card = await Card.findOne({ userId });
    if (!card) {
      throw new ValidationError('Card not found');
    }

    if (card.status !== 'active') {
      throw new ValidationError('Card must be active to change PIN');
    }

    // Hash the new PIN
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(newPin, salt);

    // Update card with new PIN hash
    await Card.findByIdAndUpdate(card._id, { pinHash });

    return { message: 'Card PIN changed successfully' };
  }

  async resetCardPIN(userId) {
    const card = await Card.findOne({ userId });
    if (!card) {
      throw new ValidationError('Card not found');
    }

    if (card.status !== 'active') {
      throw new ValidationError('Card must be active to reset PIN');
    }

    // Remove PIN hash to allow setting a new one
    await Card.findByIdAndUpdate(card._id, { 
      $unset: { pinHash: 1 }
    });

    return { message: 'Card PIN reset successfully. Please set a new PIN.' };
  }
}

export const cardPinService = new CardPinService();