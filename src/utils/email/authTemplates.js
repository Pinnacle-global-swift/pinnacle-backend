import { renderBaseTemplate } from './templateBase.js';

export const authEmailTemplates = {
    otpVerification: (name, accountType, uniqueId, otp) => {
        const title = 'Secure Verification Code';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Verify Your Identity</h1>
            <p>Dear ${name},</p>
            <p>Welcome to <strong>Pinnacle Global Swift</strong>. To ensure your account's security, please use the following one-time verification code to complete your registration.</p>
            
            <div class="info-card">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Verification Code</p>
                <p style="margin: 10px 0 0; font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #1e3a8a; letter-spacing: 6px; text-align: center;">${otp}</p>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
                <strong>Account Details:</strong><br>
                Type: ${accountType}<br>
                Customer ID: ${uniqueId}
            </p>
            
            <p style="margin-top: 30px;">This code will expire in 15 minutes. If you did not request this code, please secure your account immediately by contacting our support team.</p>
        `;
        return {
            subject: 'Pinnacle Global Swift - Verification Code',
            html: renderBaseTemplate(title, content, 'Your secure verification code is inside.')
        };
    },

    forgotPassword: (name, otp, uniqueId) => {
        const title = 'Reset Your Password';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Password Reset Request</h1>
            <p>Hello ${name},</p>
            <p>We received a request to reset the password for your account (ID: <strong>${uniqueId}</strong>). Use the code below to proceed with resetting your PIN/Password.</p>
            
            <div class="info-card" style="text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Reset Code</p>
                <p style="margin: 10px 0 0; font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #1e3a8a; letter-spacing: 4px;">${otp}</p>
            </div>
            
            <p>For your security, this code is only valid for 15 minutes. If you did not initiate this request, please contact us immediately as your account security may be compromised.</p>
            
            <a href="#" class="button">Reset Password</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Password Reset Request',
            html: renderBaseTemplate(title, content, 'Follow the instructions to reset your password.')
        };
    },

    passwordChanged: (name, uniqueId) => {
        const title = 'Security Update: Password Changed';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Security Alert</h1>
            <p>Hello ${name},</p>
            <p>This is a confirmation that the password for your Pinnacle Global Swift account (ID: <strong>${uniqueId}</strong>) has been successfully changed.</p>
            
            <div class="info-card" style="border-left: 4px solid #1e3a8a;">
                <p style="margin: 0;">If you performed this action, you can safely ignore this email.</p>
            </div>
            
            <p><strong>Didn't make this change?</strong><br>
            If you do not recognize this activity, please contact our Fraud Prevention team immediately at security@pinnacleglobalswift.com or call our 24/7 support line.</p>
            
            <a href="#" class="button">Review Account Activity</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Password Changed Successfully',
            html: renderBaseTemplate(title, content, 'The password for your account was recently updated.')
        };
    }
};