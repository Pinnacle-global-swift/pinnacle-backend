export const authEmailTemplates = {
    //     otpVerification: (name, otp) => ({
    //       subject: 'PINNACLE GLOBAL SWIFT - Email Verification OTP',
    //       html: `
    //   <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>PINNACLE GLOBAL SWIFT - Email Verification</title>
    // </head>
    // <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    //     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    //         <tr>
    //             <td style="padding: 20px 0;">
    //                 <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    //                     <!-- Header -->
    //                     <tr>
    //                         <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
    //                             <img src="https://via.placeholder.com/200x50.png?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
    //                         </td>
    //                     </tr>
    //                     <!-- Content -->
    //                     <tr>
    //                         <td style="padding: 40px;">
    //                             <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Verify Your Email</h1>
    //                             <p style="margin: 0 0 20px;">Hello [NAME],</p>
    //                             <p style="margin: 0 0 20px;">Thank you for choosing PINNACLE GLOBAL SWIFT. To complete your account verification, please use the following code:</p>
    //                             <div style="background-color: #f5f5f5; border: 2px solid #2A69ED; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
    //                                 <p style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #2A69ED; font-weight: bold; margin: 0;">[OTP_CODE]</p>
    //                             </div>
    //                             <p style="margin: 0 0 20px; font-weight: bold;">This code will expire in 15 minutes.</p>
    //                             <p style="margin: 0 0 20px;">If you didn't request this code, please ignore this email or contact our support team immediately.</p>
    //                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
    //                                 <tr>
    //                                     <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
    //                                         <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Verify Email</a>
    //                                     </td>
    //                                 </tr>
    //                             </table>
    //                             <p style="margin: 0; font-style: italic; color: #666666;">For your security, please do not share this code with anyone.</p>
    //                         </td>
    //                     </tr>
    //                     <!-- Footer -->
    //                     <tr>
    //                         <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
    //                             <p style="margin: 0 0 10px;">© [CURRENT_YEAR] PINNACLE GLOBAL SWIFT. All rights reserved.</p>
    //                             <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
    //                             <p style="margin: 10px 0 0;">
    //                                 <a href="#" style="color: #2A69ED; text-decoration: none;">Privacy Policy</a> | 
    //                                 <a href="#" style="color: #2A69ED; text-decoration: none;">Terms of Service</a> | 
    //                                 <a href="#" style="color: #2A69ED; text-decoration: none;">Contact Support</a>
    //                             </p>
    //                         </td>
    //                     </tr>
    //                 </table>
    //             </td>
    //         </tr>
    //     </table>
    // </body>
    // </html>
    //       `
    //     }),

    otpVerification: (name, accountType, uniqueId, otp,) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Email Verification OTP',
        html: `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Email Verification</title>
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
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Verify Your Email</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">Welcome to PINNACLE GLOBAL SWIFT! We're excited to have you on board.</p>
                            <div style="background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0 0 10px;"><strong>Account Type:</strong> ${accountType}</p>
                                <p style="margin: 0;"><strong>Customer ID:</strong> ${uniqueId}</p>
                            </div>
                            <p style="margin: 0 0 20px;">To complete your account verification, please use the following code:</p>
                            <div style="background-color: #f5f5f5; border: 2px solid #2A69ED; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                                <p style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #2A69ED; font-weight: bold; margin: 0;">${otp}</p>
                            </div>
                            <p style="margin: 0 0 20px; font-weight: bold;">This code will expire in 15 minutes.</p>
                            <p style="margin: 0 0 20px;">If you didn't request this code, please contact our support team immediately.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Verify Email</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; font-style: italic; color: #666666;">For your security, please do not share this code or email with anyone.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0 0 10px;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 0;">For security reasons, please do not share this email or your OTP with anyone.</p>
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

    // Add new forgotPassword template
    forgotPassword: (name, otp, uniqueId) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Password Reset Request',
        html:
            `
          <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Password Reset Request</title>
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
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Password Reset Request</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <p style="margin: 0 0 20px;">We received a request to reset your PINNACLE GLOBAL SWIFT account password. If you did not initiate this request, please contact our support team immediately.</p>
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                                    <tr>
                                        <td style="color: #666666;">Customer ID:</td>
                                        <td style="text-align: right; font-family: monospace; font-weight: bold;">${uniqueId}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Request Time:</td>
                                        <td style="text-align: right;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            <p style="margin: 0 0 20px;">Your password reset code is:</p>
                            <div style="background-color: #e8f5e9; border: 2px solid #2A69ED; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                                <p style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #2A69ED; font-weight: bold; margin: 0;">${otp}</p>
                            </div>
                            <p style="margin: 0 0 20px; font-weight: bold;">This code will expire in 15 minutes.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #ef6c00; font-weight: bold;">Security Notice:</p>
                                <ul style="margin: 10px 0 0; padding-left: 20px; color: #666666;">
                                    <li>Never share your password reset code with anyone.</li>
                                    <li>PINNACLE GLOBAL SWIFT will never ask for your full password or OTP over email or phone.</li>
                                    <li>Always ensure you're on our official website before entering sensitive information.</li>
                                </ul>
                            </div>
                            <p style="margin: 0; font-style: italic; color: #666666;">If you didn't request this password reset, please contact our support team immediately.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
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

    // Add new passwordChanged template
    passwordChanged: (name, uniqueId) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Password Changed Successfully',
        html: `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Password Changed Successfully</title>
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
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Password Changed Successfully</h1>
                            <p style="margin: 0 0 20px;">Hello ${name},</p>
                            <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 18px; color: #2e7d32;">
                                    Your PINNACLE GLOBAL SWIFT account password has been successfully changed.
                                </p>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                                    <tr>
                                        <td style="color: #666666;">Customer ID:</td>
                                        <td style="text-align: right; font-family: monospace; font-weight: bold;">${uniqueId}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Change Time:</td>
                                        <td style="text-align: right;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #ef6c00; font-weight: bold;">Important Notice:</p>
                                <p style="margin: 10px 0 0; color: #666666;">If you did not make this change, please contact our support team immediately.</p>
                            </div>
                            <div style="margin: 30px 0;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; color: #2A69ED;">Security Tips:</h2>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Never share your password with anyone</li>
                                    <li style="margin-bottom: 10px;">Use a strong, unique password</li>
                                    <li style="margin-bottom: 10px;">Enable two-factor authentication for added security</li>
                                    <li>Regularly monitor your account activity</li>
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
                            <p style="margin: 0 0 10px;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 0;">For any concerns, please contact our 24/7 support.</p>
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