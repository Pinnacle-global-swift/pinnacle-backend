import cloudinary from '../config/cloudinaryConfig.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadToCloudinary = async (file, folder) => {
  try {
    // Create a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // Convert buffer to base64 for Cloudinary upload
    const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder: folder, // This will create organized folders in Cloudinary
      public_id: uniqueFileName.split('.')[0], // Remove extension as Cloudinary handles it
      resource_type: 'auto', // Automatically detect file type (image, video, etc.)
      quality: 'auto:good', // Optimize quality
      fetch_format: 'auto' // Optimize format delivery
    });

    return result.secure_url; // Return the HTTPS URL
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};