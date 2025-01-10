# Pinnale Global Bank.IO API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "accountType": "personal | business",
  "fullName": "string",
  "gender": "male | female | other",
  "email": "string",
  "password": "string",
  "country": "string",
  "address": "string",
  "phoneNumber": "string"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent."
}
```

### Verify OTP
```http
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      // ... other user details
    }
  }
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "string",
  "password": "string"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## Account Endpoints

### Get Account Information
```http
GET /account/info
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "accountNumber": "string",
    "balance": "number",
    "currency": "string",
    "status": "string"
  }
}
```

## Card Endpoints

### Get Card Status
```http
GET /cards/status
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "hasCard": "boolean",
    "cardDetails": {
      "type": "string",
      "status": "string",
      "cardNumber": "string",
      // ... other card details
    }
  }
}
```

### Apply for Card
```http
POST /cards/apply
```

**Request Body:**
```json
{
  "type": "virtual_debit | premium_credit"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "cardDetails": {
      "type": "string",
      "status": "string",
      // ... other card details
    }
  }
}
```

## Public Endpoints (No Authentication Required)

### Apply for Card (Public)
```http
POST /public/card-application
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "cardType": "virtual_debit | premium_credit"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "message": "Application submitted successfully",
    "applicationId": "string"
  }
}
```

### Submit Support Ticket
```http
POST /public/support
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "subject": "string",
  "message": "string"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "message": "Support ticket submitted successfully",
    "ticketId": "string"
  }
}
```

## User Settings Endpoints

### Update Profile
```http
PUT /users/profile
```

**Request Body:**
```json
{
  "fullName": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      // Updated user details
    }
  }
}
```

### Update Language Preference
```http
PUT /users/language
```

**Request Body:**
```json
{
  "language": "English | Spanish | French | German | Italian"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "language": "string"
  }
}
```

### Update Transaction Limits
```http
PUT /users/transaction-limits
```

**Request Body:**
```json
{
  "dailyTransfer": "number",
  "dailyWithdrawal": "number",
  "cardSpending": "number"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "transactionLimits": {
      "dailyTransfer": "number",
      "dailyWithdrawal": "number",
      "cardSpending": "number"
    }
  }
}
```

## Notifications Endpoints

### Get User Notifications
```http
GET /notifications
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "title": "string",
      "message": "string",
      "type": "info | success | warning | error",
      "isRead": "boolean",
      "createdAt": "string"
    }
  ]
}
```

### Mark Notifications as Read
```http
POST /notifications/mark-read
```

**Request Body:**
```json
{
  "notificationIds": ["string"]
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Notifications marked as read"
}
```

## Important Notes

1. **Account Numbers**
   - All account numbers are 10 digits
   - First 3 digits are constant (123)
   - Remaining 7 digits are unique per user

2. **OTP Verification**
   - OTP is 6 digits
   - Valid for 15 minutes
   - Sent via email

3. **Transaction Limits**
   - Daily Transfer: Max 5,000 USD
   - Daily Withdrawal: Max 2,000 USD
   - Card Spending: Max 10,000 USD

4. **Card Types**
   - Virtual Debit
     - Limit: 10,000 USD
     - No payment required
   - Premium Credit
     - Limit: 50,000 USD
     - Payment required: 99 USD

5. **Email Templates**
   - Registration OTP
   - Transaction Alerts
   - Card Status Updates
   - Support Ticket Confirmation

## Rate Limiting
- 100 requests per IP per hour for public endpoints
- 1000 requests per user per hour for authenticated endpoints

## Security Recommendations
1. Always use HTTPS
2. Store JWT token securely
3. Implement proper logout by clearing stored tokens
4. Never log sensitive information
5. Validate all user inputs
6. Implement proper error handling

## Testing
- Test environment available at: `http://localhost:3000/api`
- Swagger documentation: `http://localhost:3000/api-docs`