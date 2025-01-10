import { cardPinService } from '../services/cardPinService.js';

export const cardPinController = {
  async setPin(req, res, next) {
    try {
      const { pin } = req.body;
      const result = await cardPinService.setCardPIN(req.user.id, pin);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
};