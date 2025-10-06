# Render Deployment Guide

## Environment Variables Setup

In your Render service dashboard, add these environment variables:

### Required Variables:
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://PinnacleGlobalswift:yqv9Cm76TG9KKqdH@cluster0.dm2o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-secure-secret-key-here
JWT_EXPIRES_IN=7d

# Email Configuration - Zoho Mail
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=support@pinnacleglobalswift.com
EMAIL_PASSWORD=MKgtNFJd3WF6
EMAIL_FROM=support@pinnacleglobalswift.com

# Cloudinary Configuration (update with your actual values)
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## Troubleshooting Email Issues on Render

### Common Problems:
1. **SMTP Timeout**: Render may block certain SMTP ports
2. **Firewall Restrictions**: Some email providers are blocked
3. **Authentication Issues**: 2FA might be required

### Solutions:

#### Option 1: Use Alternative Email Services
Consider using:
- **SendGrid** (recommended for production)
- **Mailgun**
- **AWS SES**
- **Postmark**

#### Option 2: Make Email Non-Critical
- Login should work even if email fails
- Email notifications become optional

#### Option 3: Use Email Queue
- Implement Redis-based email queue
- Process emails asynchronously

## SendGrid Integration (Recommended)

If SMTP continues to fail, switch to SendGrid:

1. Sign up at sendgrid.com
2. Get your API key
3. Update environment variables:
```
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=support@pinnacleglobalswift.com
```

4. Install SendGrid SDK:
```bash
npm install @sendgrid/mail
```

## Render Specific Configuration

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

### Environment:
- Node.js version: 18+ (recommended)
- Auto-deploy: Enable for main branch

## Health Check

Your app now includes:
- `GET /` - API status
- `GET /health` - Health check

Render will automatically detect your service is running on the configured port.

## Common Deployment Issues

### 1. Port Binding
- Render automatically sets the PORT environment variable
- Your app should use `process.env.PORT || 3001`

### 2. Database Connection
- Ensure MongoDB URI allows connections from anywhere (0.0.0.0/0)
- Check MongoDB Atlas network access settings

### 3. Environment Variables
- Double-check all variables are set in Render dashboard
- Verify no typos in variable names

### 4. Build Failures
- Check build logs for missing dependencies
- Ensure all imports use correct file extensions (.js)

## Testing Your Deployment

1. **Basic API Test**:
   ```
   GET https://your-app.onrender.com/
   ```

2. **Health Check**:
   ```
   GET https://your-app.onrender.com/health
   ```

3. **Login Test**:
   ```
   POST https://your-app.onrender.com/api/auth/login
   ```

## Monitoring

- Check Render logs for any errors
- Monitor email delivery (consider adding email logging)
- Set up alerts for service downtime