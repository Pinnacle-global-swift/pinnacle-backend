import express from 'express';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Only enable in development
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email', async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      
      const result = await emailService.sendEmail(to, {
        subject: subject || 'Test Email',
        html: html || '<h1>Test Email Content</h1>'
      });

      res.json({
        success: true,
        messageId: result.messageId,
        preview: result.preview,
        response: result.response
      });
    } catch (error) {
      logger.error('Test email failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

export const devRoutes = router;
