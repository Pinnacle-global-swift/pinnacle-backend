import { renderBaseTemplate } from './templateBase.js';

export const EmailTemplates = {
    verifyKyc: (name) => {
        const title = 'Identity Verification Required';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Identity Verification</h1>
            <p>Dear ${name},</p>
            <p>To provide you with the highest level of security and access to all our premium banking features, we require a quick identity verification.</p>
            
            <div class="info-card" style="border-left: 4px solid #1e3a8a;">
                <p style="margin: 0;">Please ensure you have your valid government-issued ID ready before starting the process.</p>
            </div>
            
            <p>Verifying your identity helps us protect your account and comply with global financial regulations.</p>
            
            <a href="#" class="button">Submit KYC Documents</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Identity Verification Required',
            html: renderBaseTemplate(title, content, 'Complete your identity verification to unlock full account features.')
        };
    },

    kycRejection: (name, reason, remarks) => {
        const title = 'Identity Verification Update';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Verification Update</h1>
            <p>Dear ${name},</p>
            <p>Thank you for submitting your identity verification documents. After a careful review by our compliance team, we regret to inform you that your verification could not be approved at this time.</p>
            
            <div class="info-card" style="border-left: 4px solid #ef4444; background-color: #fef2f2;">
                <p><strong>Reason:</strong> ${reason}</p>
                <p><strong>Additional Remarks:</strong> ${remarks}</p>
            </div>
            
            <p>You can re-submit your documents through the dashboard. Please ensure that all information matches your official documents and that images are clear and well-lit.</p>
            
            <a href="#" class="button" style="background-color: #ef4444;">Review and Resubmit</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Verification Update',
            html: renderBaseTemplate(title, content, 'Important update regarding your identity verification.')
        };
    },

    cardApplicationReceived: (name) => {
        const title = 'Card Application Received';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Application Submitted</h1>
            <p>Dear ${name},</p>
            <p>We have successfully received your request for a Pinnacle Global Swift Premium Card. Your application is currently being prioritized by our card services department.</p>
            
            <div class="info-card">
                <p style="margin: 0; font-weight: 600;">Status: Processing</p>
                <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;">Estimated review time: 1-2 business days.</p>
            </div>
            
            <p>Once approved, you will receive a notification with delivery details or digital card activation instructions.</p>
            
            <a href="#" class="button">Track Application</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Card Application Received',
            html: renderBaseTemplate(title, content, "We've received your card application.")
        };
    },

    cardApplicationStatus: (name, status, type, remarks) => {
        const title = `Card Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Application Status Update</h1>
            <p>Dear ${name},</p>
            <p>There has been an update to your ${type} card application.</p>
            
            <div class="info-card" style="border-left: 4px solid ${status === 'approved' ? '#10b981' : '#ef4444'};">
                <p style="margin: 0; font-size: 18px; color: ${status === 'approved' ? '#065f46' : '#991b1b'};">
                    Status: <strong>${status.toUpperCase()}</strong>
                </p>
                ${remarks ? `<p style="margin: 10px 0 0; color: #64748b;"><strong>Remarks:</strong> ${remarks}</p>` : ''}
            </div>
            
            ${status === 'approved' ? `
                <p>Your premium card is being prepared and will be dispatched shortly. You will receive another notification once it's on its way.</p>
            ` : `
                <p>If you have any questions regarding this decision, please contact your relationship manager.</p>
            `}
            
            <a href="#" class="button">View Account Dashboard</a>
        `;
        return {
            subject: `Pinnacle Global Swift - Card Application ${status}`,
            html: renderBaseTemplate(title, content, `Your card application has been ${status}.`)
        };
    },

    transferConfirmation: (amount, beneficiaryName, accountNumber, reference) => {
        const title = 'Transfer Successful';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Transaction Confirmed</h1>
            <p>Dear Valued Customer,</p>
            <p>Your transfer request has been successfully processed. The funds are now on their way to the beneficiary.</p>
            
            <div class="info-card">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 5px 0; color: #64748b;">Amount:</td>
                        <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #1e3a8a;">$${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #64748b;">Beneficiary:</td>
                        <td style="padding: 5px 0; text-align: right;">${beneficiaryName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #64748b;">Account:</td>
                        <td style="padding: 5px 0; text-align: right;">${accountNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #64748b;">Reference:</td>
                        <td style="padding: 5px 0; text-align: right; font-family: monospace;">${reference}</td>
                    </tr>
                </table>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">If you did not authorize this transaction, please notify our fraud department immediately.</p>
            
            <a href="#" class="button">Download Receipt</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Transfer Confirmation',
            html: renderBaseTemplate(title, content, `You successfully sent $${amount} to ${beneficiaryName}.`)
        };
    },

    supportTicketReceived: (name, ticketId) => {
        const title = 'Support Request Received';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">We're Here to Help</h1>
            <p>Dear ${name},</p>
            <p>Your support request has been successfully logged. Our dedicated relationship managers are reviewing your inquiry and will provide a detailed response shortly.</p>
            
            <div class="info-card">
                <p style="margin: 0; font-weight: 600;">Ticket ID: #${ticketId}</p>
            </div>
            
            <p>For urgent matters, please use the private concierge feature within your mobile app.</p>
        `;
        return {
            subject: `Pinnacle Global Swift Support - Ticket #${ticketId}`,
            html: renderBaseTemplate(title, content, "We've received your inquiry and are working on it.")
        };
    },

    adminCustomMessage: (title, message) => {
        const emailTitle = title || 'Official Communication';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">${emailTitle}</h1>
            <p>Dear Valued Customer,</p>
            <div style="line-height: 1.6; color: #334155; margin-bottom: 30px;">
                ${message}
            </div>
            
            <div class="info-card" style="border-left: 4px solid #1e3a8a;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                    This is an official communication from your Pinnacle Global Swift relationship management team.
                </p>
            </div>
        `;
        return {
            subject: `Pinnacle Global Swift - ${emailTitle}`,
            html: renderBaseTemplate(emailTitle, content, "Official communication regarding your account.")
        };
    }
};