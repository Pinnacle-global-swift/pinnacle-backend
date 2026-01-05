export const renderBaseTemplate = (title, content, preheader = '') => {
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        :root {
            --primary: #1e3a8a;
            --primary-light: #2563eb;
            --bg: #f8fafc;
            --text: #1e293b;
            --text-light: #64748b;
        }
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px 20px; text-align: center; }
        .logo { max-width: 180px; height: auto; }
        .content { padding: 40px; }
        .footer { padding: 40px 20px; text-align: center; font-size: 13px; color: #64748b; background-color: #f8fafc; }
        .button { display: inline-block; padding: 14px 28px; background-color: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .divider { border-top: 1px solid #e2e8f0; margin: 30px 0; }
        .info-card { background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .social-links a { margin: 0 10px; color: #64748b; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .content { padding: 25px; }
            .container { border-radius: 0; }
        }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
    <div class="wrapper">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <div class="container">
                        <div class="header">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgbw.png?alt=media&token=bbf2f313-a323-467f-a87e-d555f4337e15?text=Pinnacle+Global+Swift" alt="Pinnacle Global Swift" class="logo">
                        </div>
                        <div class="content">
                            ${content}
                        </div>
                    </div>
                    <div class="footer">
                        <p style="margin-bottom: 15px; font-weight: 600; color: #1e293b;">Pinnacle Global Swift</p>
                        <p style="margin-bottom: 8px;">123 Financial District, Suite 500, New York, NY 10004</p>
                        <p style="margin-bottom: 20px;">© ${currentYear} Pinnacle Global Swift. All rights reserved.</p>
                        <div class="social-links">
                            <a href="#">Security Center</a> | <a href="#">Support</a> | <a href="#">Terms of Service</a>
                        </div>
                        <p style="margin-top: 25px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                            You received this email because you are a registered user of Pinnacle Global Swift. 
                            This is an automated security notice. For your protection, never share your account details or OTP with anyone.
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};
