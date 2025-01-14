export const welcomeEmailTemplates = {
    newUserWelcome: (name, uniqueId, accountType) => ({
        subject: 'Welcome to PINNACLE GLOBAL SWIFT',
        html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to PINNACLE GLOBAL SWIFT</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgbw.png?alt=media&token=bbf2f313-a323-467f-a87e-d555f4337e15text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Welcome Banner -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Welcome to PINNACLE GLOBAL SWIFT!</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px;">Dear ${name},</p>
                            <p style="margin: 0 0 20px;">Thank you for choosing PINNACLE GLOBAL SWIFT. We're excited to have you as our valued customer!</p>
                            
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Your Account Information:</h2>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                                    <tr>
                                        <td style="color: #666666;"><strong>Customer ID:</strong></td>
                                        <td style="text-align: right; font-family: monospace; font-weight: bold;">${uniqueId}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;"><strong>Account Type:</strong></td>
                                        <td style="text-align: right;">${accountType}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="margin: 30px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Next Steps:</h2>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="background-color: #2A69ED; border-radius: 50%; height: 24px; width: 24px; text-align: center; vertical-align: middle; color: #ffffff; font-size: 14px;">✓</td>
                                                    <td style="padding-left: 10px;">Complete your email verification</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="background-color: #2A69ED; border-radius: 50%; height: 24px; width: 24px; text-align: center; vertical-align: middle; color: #ffffff; font-size: 14px;">✓</td>
                                                    <td style="padding-left: 10px;">Set up two-factor authentication</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="background-color: #2A69ED; border-radius: 50%; height: 24px; width: 24px; text-align: center; vertical-align: middle; color: #ffffff; font-size: 14px;">✓</td>
                                                    <td style="padding-left: 10px;">Download our mobile banking app</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="background-color: #2A69ED; border-radius: 50%; height: 24px; width: 24px; text-align: center; vertical-align: middle; color: #ffffff; font-size: 14px;">✓</td>
                                                    <td style="padding-left: 10px;">Explore our online banking features</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Security Tips:</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Never share your password or OTP with anyone</li>
                                    <li style="margin-bottom: 10px;">Use a strong, unique password</li>
                                    <li style="margin-bottom: 10px;">Keep your account information confidential</li>
                                    <li>Regularly monitor your account activity</li>
                                </ul>
                            </div>

                            <p style="margin: 20px 0;">If you have any questions or need assistance, our customer support team is available 24/7.</p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Get Started</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This email was sent to you as part of your PINNACLE GLOBAL SWIFT account registration.</p>
                            <p style="margin: 0;">Please do not reply to this email.</p>
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

    successfulLogin: (name, loginTime, deviceInfo) => ({
        subject: 'PINNACLE GLOBAL SWIFT - New Login Alert',
        html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - New Login Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgbw.png?alt=media&token=bbf2f313-a323-467f-a87e-d555f4337e15?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">New Login Alert</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">We detected a new login to your PINNACLE GLOBAL SWIFT account. If this was you, no further action is needed. If you don't recognize this activity, please take immediate action.</p>
                            
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Login Details:</h2>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                                    <tr>
                                        <td style="color: #666666;"><strong>Time:</strong></td>
                                        <td style="text-align: right;">${loginTime}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;"><strong>Device:</strong></td>
                                        <td style="text-align: right;">${deviceInfo.device}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;"><strong>Browser:</strong></td>
                                        <td style="text-align: right;">${deviceInfo.browser}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;"><strong>Location:</strong></td>
                                        <td style="text-align: right;">${deviceInfo.location}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #ef6c00; font-weight: bold;">
                                    If you don't recognize this login activity, please contact our support team immediately and change your password.
                                </p>
                            </div>

                            <div style="margin: 30px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Security Reminders:</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Never share your login credentials with anyone</li>
                                    <li style="margin-bottom: 10px;">Enable two-factor authentication for enhanced security</li>
                                    <li style="margin-bottom: 10px;">Regularly update your password (every 3-6 months)</li>
                                    <li>Monitor your account activity and report any suspicious transactions</li>
                                </ul>
                            </div>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Review Account Activity</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This is an automated security alert. Please do not reply to this email.</p>
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