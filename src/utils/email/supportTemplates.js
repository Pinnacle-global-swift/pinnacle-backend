export const supportEmailTemplates = {
  ticketConfirmation: (name, ticketId, subject) => ({
    subject: 'PINNACLE GLOBAL SWIFT - Support Ticket Confirmation',
    html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                color: #333333;
              }
              .header {
                background-color: #1a1a1a;
                padding: 20px;
                text-align: center;
              }
              .logo {
                color: #ffffff;
                font-size: 24px;
                font-weight: bold;
              }
              .content {
                padding: 20px;
                background-color: #ffffff;
              }
              .ticket-info {
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
              }
              .ticket-id {
                font-family: monospace;
                font-size: 18px;
                color: #2A69ED;
              }
              .footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="logo">PINNACLE GLOBAL SWIFT</div>
              </div>
              <div class="content">
                <h2>Support Ticket Confirmation</h2>
                <p>Hello ${name},</p>
                <p>Thank you for contacting PINNACLE GLOBAL SWIFT support. We have received your ticket:</p>
                <div class="ticket-info">
                  <p><strong>Ticket ID:</strong> <span class="ticket-id">${ticketId}</span></p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Status:</strong> Open</p>
                </div>
                <p>Our support team will review your request and respond within 24 hours.</p>
                <p>Please keep your ticket ID for future reference.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
  })
};