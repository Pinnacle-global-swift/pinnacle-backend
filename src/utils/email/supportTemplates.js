import { renderBaseTemplate } from './templateBase.js';

export const supportEmailTemplates = {
  ticketConfirmation: (name, ticketId, subject) => {
    const title = 'Support Ticket Confirmation';
    const content = `
        <h1 style="color: #1e3a8a; margin-bottom: 20px;">We've Got Your Request</h1>
        <p>Hello ${name},</p>
        <p>Thank you for contacting Pinnacle Global Swift support. We have received your ticket and a member of our team will follow up shortly.</p>

        <div class="info-card">
            <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> <span style="font-family: 'Courier New', monospace; color: #1e3a8a;">${ticketId}</span></p>
            <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0;"><strong>Status:</strong> Open</p>
        </div>

        <p>Our support team will review your request and respond within 24 hours. Please keep your ticket ID for future reference.</p>
    `;
    return {
      subject: 'Pinnacle Global Swift - Support Ticket Confirmation',
      html: renderBaseTemplate(title, content, `We've received your support ticket #${ticketId}.`)
    };
  }
};
