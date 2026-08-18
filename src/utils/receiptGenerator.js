import { renderBaseTemplate } from './email/templateBase.js';

export const generateReceipt = async (transaction) => {
    const date = new Date(transaction.createdAt).toLocaleString();
    const status = transaction.status.toLowerCase();
    const type = transaction.type.toLowerCase();
    const isCompleted = status === 'completed';

    const typeColors = {
        deposit: { bg: '#e8f5e9', text: '#2e7d32' },
        withdrawal: { bg: '#ffebee', text: '#c62828' }
    };
    const typeColor = typeColors[type] || { bg: '#e3f2fd', text: '#1565c0' };

    const title = 'Transaction Receipt';
    const content = `
        <h1 style="color: #1e3a8a; margin-bottom: 20px;">Transaction Receipt</h1>

        <div class="info-card" style="text-align: center; background-color: ${isCompleted ? '#e8f5e9' : '#fff3e0'};">
            <p style="margin: 0; font-size: 16px; color: ${isCompleted ? '#065f46' : '#ef6c00'};">Transaction ${transaction.status}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Transaction Amount</p>
            <h2 style="margin: 0; color: #1e3a8a; font-size: 36px; font-weight: 700;">$${transaction.amount.toFixed(2)}</h2>
        </div>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Transaction ID:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: 'Courier New', monospace; font-weight: 600;">${transaction.reference}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date &amp; Time:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${date}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="background-color: ${typeColor.bg}; color: ${typeColor.text}; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">${transaction.type}</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #64748b;">Balance After:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #1e3a8a;">$${transaction.balanceAfter.toFixed(2)}</td>
            </tr>
        </table>

        <p style="font-size: 13px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            This is an official transaction receipt from Pinnacle Global Swift. Please keep this for your records.
        </p>
    `;

    return renderBaseTemplate(title, content, `Your ${transaction.type.toLowerCase()} of $${transaction.amount.toFixed(2)} is ${transaction.status}.`);
};
