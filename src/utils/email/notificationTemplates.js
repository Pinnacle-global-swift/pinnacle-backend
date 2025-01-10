export const notificationTemplates = {
    adminTransferAlert: (name, amount, balance) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Admin Transfer Alert',
        html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Admin Transfer Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgb.png?alt=media&token=1a9dcde5-62a3-4eaf-9c96-9cd3d56f2b64?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Admin Transfer Alert</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">An administrative transfer has been processed on your account:</p>
                            <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                                <p style="margin: 0; font-size: 36px; font-weight: bold; color: #2A69ED;">
                                    +${amount} USD
                                </p>
                                <p style="margin: 10px 0 0; font-size: 18px; color: #666666;">
                                    Credited to your account
                                </p>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Transaction Type:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">Administrative Transfer</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Date & Time:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date().toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666;">New Balance:</td>
                                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${balance} USD</td>
                                </tr>
                            </table>
                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #ef6c00; font-weight: bold;">
                                    This transfer was initiated by our administrative team. If you have any questions or concerns about this transaction, please contact our support team immediately.
                                </p>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">View Transaction Details</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 0;">For your account security, please verify this transaction and report any discrepancies to our support team.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 10px 0 0;">
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `
    }),

    transactionAlert: (name, amount, type, balance) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Transaction Alert',
        html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Transaction Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgb.png?alt=media&token=1a9dcde5-62a3-4eaf-9c96-9cd3d56f2b64?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Transaction Alert</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">A transaction has been processed on your account:</p>
                            <div style="background-color: ${type === 'Credit' ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                                <p style="margin: 0; font-size: 36px; font-weight: bold; color: ${type === 'Credit' ? '#2A69ED' : '#DC2626'};">
                                    ${type === 'Credit' ? '+' : '-'}${amount} USD
                                </p>
                                <p style="margin: 10px 0 0; font-size: 18px; color: #666666;">
                                    ${type === 'Credit' ? 'Credited to' : 'Debited from'} your account
                                </p>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Transaction Type:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">${type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Date & Time:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date().toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666;">New Balance:</td>
                                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${balance} USD</td>
                                </tr>
                            </table>
                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #ef6c00; font-weight: bold;">
                                    If you didn't authorize this transaction, please contact our support team immediately.
                                </p>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">View Transaction Details</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 10px 0 0;">
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `
    }),
    cardStatusUpdate: (name, cardType, status) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Card Status Update',
        html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Card Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgb.png?alt=media&token=1a9dcde5-62a3-4eaf-9c96-9cd3d56f2b64?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Card Status Update</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">Your ${cardType} card application status has been updated:</p>
                            <div style="background-color: ${status === 'approved' ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                                <p style="margin: 0; font-size: 36px; font-weight: bold; color: ${status === 'approved' ? '#2A69ED' : '#DC2626'};">
                                    ${status.toUpperCase()}
                                </p>
                            </div>
                            ${status === 'approved' ? `
                            <div style="margin: 20px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Next Steps:</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Your new card will be mailed to your registered address within 5-7 business days.</li>
                                    <li style="margin-bottom: 10px;">Once received, follow the instructions provided to activate your card.</li>
                                    <li>For security reasons, your PIN will be sent in a separate mailing.</li>
                                </ul>
                            </div>
                            ` : `
                            <div style="margin: 20px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #DC2626;">What This Means:</h2>
                                <p style="margin: 0 0 10px; color: #666666;">We're sorry, but we couldn't approve your card application at this time. This decision was based on the information provided in your application and our current lending criteria.</p>
                                <p style="margin: 0; color: #666666;">You can contact our support team for more information about this decision and to discuss your options moving forward.</p>
                            </div>
                            `}
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Card Type:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">${cardType}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #666666;">Application Date:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${new Date().toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666;">Decision Date:</td>
                                    <td style="padding: 10px 0; text-align: right;">${new Date().toLocaleDateString()}</td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0;">If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 10px 0 0;">
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `
    })
};