import express from 'express';
import { emailService } from '../utils/email/emailService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/test-email', async (req, res) => {
    try {
        const result = await emailService.sendEmail('pinnacleglobalswift@gmail.com', {
            subject: 'Pinnacle Test Email',
            html: '<h1>Test Email</h1><p>This is a test email from Pinnacle Global Swift.</p>'
        });
        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: result.message_ids[0]
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
