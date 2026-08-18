import { renderBaseTemplate } from './templateBase.js';

export const notificationTemplates = {
    transactionAlert: (name, amount, type, balance, note) => {
        const isCredit = type === 'Credit';
        const title = 'Transaction Alert';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Transaction Alert</h1>
            <p>Hello ${name},</p>
            <p>A transaction has been processed on your account${note ? ` (${note})` : ''}:</p>

            <div class="info-card" style="text-align: center; background-color: ${isCredit ? '#e8f5e9' : '#ffebee'};">
                <p style="margin: 0; font-size: 36px; font-weight: 700; color: ${isCredit ? '#10b981' : '#dc2626'};">
                    ${isCredit ? '+' : '-'}$${Number(amount).toFixed(2)}
                </p>
                <p style="margin: 10px 0 0; font-size: 16px; color: #64748b;">
                    ${isCredit ? 'Credited to' : 'Debited from'} your account
                </p>
            </div>

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 10px;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Transaction Type:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${type}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date &amp; Time:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">New Balance:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #1e3a8a;">$${Number(balance).toFixed(2)}</td>
                </tr>
            </table>

            <p style="font-size: 14px; color: #64748b; margin-top: 20px;">If you didn't authorize this transaction, please contact our support team immediately.</p>

            <a href="#" class="button">View Transaction Details</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Transaction Alert',
            html: renderBaseTemplate(title, content, `Your account was ${isCredit ? 'credited' : 'debited'} $${Number(amount).toFixed(2)}.`)
        };
    },

    cardStatusUpdate: (name, cardType, status) => {
        const isApproved = status === 'approved';
        const title = 'Card Status Update';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Card Status Update</h1>
            <p>Hello ${name},</p>
            <p>Your ${cardType} card application status has been updated:</p>

            <div class="info-card" style="text-align: center; background-color: ${isApproved ? '#e8f5e9' : '#ffebee'};">
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${isApproved ? '#10b981' : '#dc2626'};">
                    ${status.toUpperCase()}
                </p>
            </div>

            ${isApproved ? `
            <div style="margin: 20px 0;">
                <h2 style="margin: 0 0 15px; font-size: 20px; color: #1e3a8a;">Next Steps</h2>
                <ul style="margin: 0; padding-left: 20px; color: #64748b;">
                    <li style="margin-bottom: 10px;">Your card is being prepared and will be dispatched shortly.</li>
                    <li style="margin-bottom: 10px;">Set a PIN from your dashboard once it's active.</li>
                    <li>For security reasons, keep your PIN confidential at all times.</li>
                </ul>
            </div>
            ` : `
            <p style="color: #64748b;">We're sorry, but we couldn't approve your card application at this time. Contact our support team for more information about this decision.</p>
            `}

            <a href="#" class="button">View Account Dashboard</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Card Status Update',
            html: renderBaseTemplate(title, content, `Your ${cardType} card application was ${status}.`)
        };
    }
};
