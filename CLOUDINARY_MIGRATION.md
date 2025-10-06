# AWS S3 to Cloudinary Migration Guide

This document outlines the complete migration from AWS S3 to Cloudinary for file and image uploads in the Pinnacle Backend application.

## Changes Made

### 1. Dependencies Updated
- **Removed**: `aws-sdk` package
- **Added**: `cloudinary` package

### 2. Configuration Files
- **Removed**: `src/config/awsConfig.js`
- **Added**: `src/config/cloudinaryConfig.js`

### 3. Upload Utilities
- **Removed**: `src/utils/s3Upload.js`
- **Added**: `src/utils/cloudinaryUpload.js`

### 4. Controllers Updated
- **KYC Controller** (`src/controllers/kycController.js`): Updated to use Cloudinary for document uploads
- **Card Controller** (`src/controllers/cardController.js`): Updated to use Cloudinary for payment receipt uploads

### 5. Environment Variables
**Old AWS Variables (removed):**
```
AWS_S3_BUCKET=vacua-storage
AWS_ACCESS_KEY_ID=AKIAZKDIDLFOCENQMH42
AWS_SECRET_ACCESS_KEY=+ikuoiP9a/P5z70bm7JgTQi8h/Wr/cN9H93wbBTS
AWS_REGION=eu-north-1
```

**New Cloudinary Variables (added):**
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Setting Up Cloudinary

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard

### Step 2: Update Environment Variables
Replace the placeholder values in `.env` with your actual Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### Step 3: Install Dependencies
```bash
npm install
```

## File Upload Structure

### Cloudinary Folder Organization
Files are now organized in Cloudinary with the following folder structure:

- **KYC Documents**: 
  - `kyc/idFront/` - ID card front images
  - `kyc/idBack/` - ID card back images  
  - `kyc/proofOfAddress/` - Proof of address documents

- **Card Receipts**:
  - `card-receipts/` - Payment receipt images

### File Processing Features
The new Cloudinary implementation includes:

1. **Automatic Format Optimization**: Files are automatically optimized for web delivery
2. **Quality Optimization**: Images are compressed for optimal loading while maintaining quality
3. **Secure URLs**: All uploads return HTTPS URLs
4. **Unique Filenames**: Each file gets a UUID to prevent conflicts
5. **Auto File Type Detection**: Supports images, PDFs, and other document types

## Benefits of Cloudinary vs AWS S3

### Advantages:
1. **Built-in Image Optimization**: Automatic compression and format conversion
2. **CDN Integration**: Global content delivery network included
3. **Simpler Implementation**: Less configuration required
4. **Better Developer Experience**: More intuitive API
5. **Free Tier**: Generous free tier for development and small applications

### Features Available:
- Image transformations (resize, crop, quality adjustment)
- Format optimization (WebP, AVIF support)
- Responsive image delivery
- Advanced upload options (quality control, progressive JPEGs)
- Built-in security features

## Testing the Migration

### Test KYC Upload:
1. Use the KYC submission endpoint with file uploads
2. Verify files appear in your Cloudinary dashboard under `kyc/` folders
3. Confirm returned URLs are HTTPS Cloudinary URLs

### Test Card Receipt Upload:
1. Use the card application endpoint with payment receipt
2. Verify files appear under `card-receipts/` folder
3. Confirm the receipt URL is stored correctly in the database

## Rollback Plan
If you need to revert to AWS S3:
1. Restore the AWS configuration files from git history
2. Update package.json to use `aws-sdk` instead of `cloudinary`
3. Revert the controller imports and function calls
4. Update environment variables back to AWS credentials

## Support
- Cloudinary Documentation: https://cloudinary.com/documentation
- Node.js SDK Guide: https://cloudinary.com/documentation/node_integration