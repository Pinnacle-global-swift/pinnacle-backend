export const EmailTemplates = {

    otpVerification: (name, accountType, uniqueId, otp) => ({
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
                            <img src="https://via.placeholder.com/200x50.png?text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto;">
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

    //  cardApplicationStatus:()=>({
    //   subject: 'PINNACLE GLOBAL SWIFT - Email Verification OTP',
    //   html:``
    //  })
    transferConfirmation: (amount, beneficiaryName, accountNumber, reference) => ({
        subject: 'PINNACLE GLOBAL SWIFT - Transfer Confirmation',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Transfer Confirmation</title>
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
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Transfer Successful</h1>
                            <p style="margin: 0 0 20px;">Dear Valued Customer,</p>
                            <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 18px; color: #2e7d32;">
                                                Your transfer has been completed successfully!
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                                    <tr>
                                        <td style="padding: 0 0 5px; color: #666666;">Amount:</td>
                                        <td style="padding: 0 0 5px; text-align: right; font-weight: bold;">$${amount}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666;">Beneficiary Name:</td>
                                        <td style="padding: 5px 0; text-align: right;">${beneficiaryName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666;">Account Number:</td>
                                        <td style="padding: 5px 0; text-align: right;">${accountNumber}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666;">Transaction Reference:</td>
                                        <td style="padding: 5px 0; text-align: right; font-family: monospace;">${reference}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666666;">Date & Time:</td>
                                        <td style="padding: 5px 0; text-align: right;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">View Transaction Details</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; font-style: italic; color: #666666;">For your security, please verify all transaction details. If you did not authorize this transfer, please contact our support team immediately.</p>
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
</html>`
    }),


    verifyKys: () => ({
        subject: 'PINNACLE GLOBAL SWIFT -  KYC Verification Submitted',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - KYC Verification Submitted</title>
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
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">KYC Verification Submitted</h1>
                            <p style="margin: 0 0 20px;">Dear Valued Customer,</p>
                            <div style="background-color: #fff3e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 18px; color: #ef6c00;">
                                                Your KYC verification has been submitted and is under review.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div style="margin: 20px 0;">
                                <p style="margin: 0 0 10px;">What happens next:</p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Our team will review your submitted documents</li>
                                    <li style="margin-bottom: 10px;">The verification process typically takes 1-2 business days</li>
                                    <li style="margin-bottom: 10px;">You'll receive an email notification once the review is complete</li>
                                    <li>If additional information is needed, we'll contact you promptly</li>
                                </ul>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #666666;">
                                    <strong>Note:</strong> During the review process, you can continue to use your account with current limitations. Full account features will be available once your KYC verification is approved.
                                </p>
                            </div>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Check Verification Status</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; font-style: italic; color: #666666;">If you have any questions about the verification process, please contact our support team.</p>
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
</html>`
    }),


    cardApplicationStatus: (status) => ({
        subject: `PINNACLE GLOBAL SWIFT - Card Application ${status}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Card Application Status</title>
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
                            <h1 style="margin: 0 0 20px; font-size: 28px; color: #2A69ED;">Card Application ${status}</h1>
                            <p style="margin: 0 0 20px;">Dear Valued Customer,</p>
                            <div style="background-color: ${status.toLowerCase() === 'approved' ? '#e8f5e9' : status.toLowerCase() === 'rejected' ? '#ffebee' : '#fff3e0'}; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 18px; color: ${status.toLowerCase() === 'approved' ? '#2e7d32' : status.toLowerCase() === 'rejected' ? '#c62828' : '#ef6c00'};">
                                                Your card application has been <strong>${status}</strong>
                                            </p>
                                            ${remarks ? `<p style="margin: 10px 0 0; color: #666666;">${remarks}</p>` : ''}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            ${status.toLowerCase() === 'approved' ? `
                            <div style="margin: 20px 0;">
                                <p style="margin: 0 0 10px;">Next steps:</p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Your card will be delivered within 5-7 business days</li>
                                    <li style="margin-bottom: 10px;">You'll receive activation instructions with your card</li>
                                    <li>Keep an eye on your email for tracking information</li>
                                </ul>
                            </div>
                            ` : status.toLowerCase() === 'rejected' ? `
                            <div style="margin: 20px 0;">
                                <p style="margin: 0 0 10px;">What you can do:</p>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666;">
                                    <li style="margin-bottom: 10px;">Review the rejection reasons provided above</li>
                                    <li style="margin-bottom: 10px;">Contact our support team for more information</li>
                                    <li>You can reapply after 3 months</li>
                                </ul>
                            </div>
                            ` : ''}
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #2A69ED; border-radius: 4px; text-align: center;">
                                        <a href="#" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">View Application Details</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; font-style: italic; color: #666666;">If you have any questions, please don't hesitate to contact our support team.</p>
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
</html>`
    })



};