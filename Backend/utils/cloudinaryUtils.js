import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import dotenv from 'dotenv'
dotenv.config()

// Check Cloudinary storage usage
export const checkCloudinarySpace = async () => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/usage`;
  const auth = {
    username: process.env.CLOUDINARY_API_KEY,
    password: process.env.CLOUDINARY_API_SECRET,
  };

  try {
    const response = await axios.get(url, { auth });
    return response.data;
  } catch (error) {
    console.error("Error checking Cloudinary usage:", error);
    return null;
  }
};

// Upload to Cloudinary
export const uploadToCloudinary = async (fileBuffer, mimetype) => {
  const fileBase64 = `data:${mimetype};base64,${fileBuffer.toString("base64")}`;
  
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: "uploads",
  });

  return result;
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Clear all Cloudinary files in uploads folder
export const clearCloudinaryFolder = async (folderName = "uploads") => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(folderName);
    return result;
  } catch (error) {
    console.error("Error clearing Cloudinary folder:", error);
    throw error;
  }
};