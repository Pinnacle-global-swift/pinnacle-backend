import { renderBaseTemplate } from './templateBase.js';

export const welcomeEmailTemplates = {
    newUserWelcome: (name, uniqueId, accountType) => {
        const title = 'Welcome to Pinnacle Global Swift';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">Welcome to Your Future In Banking</h1>
            <p>Dear ${name},</p>
            <p>We are honored that you have chosen <strong>Pinnacle Global Swift</strong> as your financial partner. Our mission is to provide you with a seamless, secure, and premium banking experience tailored to your needs.</p>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #1e3a8a;">Your Account Information</h3>
                <p style="margin: 5px 0;"><strong>Customer ID:</strong> <span style="font-family: monospace;">${uniqueId}</span></p>
                <p style="margin: 5px 0;"><strong>Account Type:</strong> ${accountType}</p>
            </div>
            
            <h3 style="color: #1e3a8a; margin-top: 30px;">Next Steps</h3>
            <ul style="padding-left: 20px;">
                <li style="margin-bottom: 10px;"><strong>Verify Your Email:</strong> Ensure your account is fully secure and linked.</li>
                <li style="margin-bottom: 10px;"><strong>Enable 2FA:</strong> Add an extra layer of security to your transactions.</li>
                <li style="margin-bottom: 10px;"><strong>Mobile App:</strong> Download our app to manage your wealth on the go.</li>
            </ul>
            
            <p style="margin-top: 30px;">Our dedicated private banking team is available 24/7 to assist you with any questions.</p>
            
            <a href="#" class="button">Access Your Dashboard</a>
        `;
        return {
            subject: 'Welcome to Pinnacle Global Swift',
            html: renderBaseTemplate(title, content, 'We are excited to have you on board.')
        };
    },

    successfulLogin: (name, loginTime, deviceInfo) => {
        const title = 'Secure Login Notice';
        const content = `
            <h1 style="color: #1e3a8a; margin-bottom: 20px;">New Login Detected</h1>
            <p>Hello ${name},</p>
            <p>This is an automated notification to let you know that a successful login occurred on your Pinnacle Global Swift account.</p>
            
            <div class="info-card">
                <p style="margin: 5px 0;"><strong>Time:</strong> ${loginTime}</p>
                <p style="margin: 5px 0;"><strong>Device:</strong> ${deviceInfo.device}</p>
                <p style="margin: 5px 0;"><strong>Browser:</strong> ${deviceInfo.browser}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${deviceInfo.location}</p>
            </div>
            
            <p>If this was you, you can Safely ignore this email. If you do not recognize this activity, please contact our security team immediately to protect your account.</p>
            
            <a href="#" class="button">Review Security Settings</a>
        `;
        return {
            subject: 'Pinnacle Global Swift - Security Login Alert',
            html: renderBaseTemplate(title, content, 'A new login was detected on your account.')
        };
    }
};