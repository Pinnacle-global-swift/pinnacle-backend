import express from 'express';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/test-email', async (req, res) => {
    try {
        const result = await emailService.sendTestEmail();
        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: result.id
        });
    } catch (error) {
        logger.error('Test email failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export const testRoutes = router;
