import File from "../models/File.js";
import {
  checkCloudinarySpace,
  uploadToCloudinary,
  deleteFromCloudinary,
  clearCloudinaryFolder,
} from "../utils/cloudinaryUtils.js";
import axios from "axios";

// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Check Cloudinary space
    const usage = await checkCloudinarySpace();
    if (!usage) {
      return res.status(500).json({
        success: false,
        message: "Unable to check Cloudinary storage usage.",
      });
    }

    const used = usage.storage.usage / 1024 / 1024; // MB
    const limit = usage.storage.limit / 1024 / 1024; // MB

    if (used >= limit) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary storage limit reached.",
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    // Save to database
    const file = await File.create({
      fileName: req.file.originalname,
      fileUrl: `${req.protocol}://${req.get("host")}/api/files/${result.public_id.replace(
        "uploads/",
        ""
      )}`,
      cloudinaryPublicId: result.public_id,
      cloudinaryUrl: result.secure_url,
      fileSize: result.bytes,
      mimeType: req.file.mimetype,
    });

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      data: {
        url: file.fileUrl,
        fileName: file.fileName,
        fileId: file._id,
        size: file.fileSize,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Get File
export const getFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      cloudinaryPublicId: `uploads/${fileId}`,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Fetch file from Cloudinary and pipe to response
    const response = await axios.get(file.cloudinaryUrl, {
      responseType: "stream",
    });

    // Set appropriate headers
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${file.fileName}"`);

    // Pipe the file stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error("File Serve Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to serve file",
      error: error.message,
    });
  }
};

// Delete File
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(file.cloudinaryPublicId);

    // Delete from database
    await File.findByIdAndDelete(fileId);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

// Get All Files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error("Get Files Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get files",
      error: error.message,
    });
  }
};

// Clear All Files
export const clearAllFiles = async (req, res) => {
  try {
    // Delete all from Cloudinary
    await clearCloudinaryFolder("uploads");

    // Delete all from database
    await File.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "All files cleared successfully",
    });
  } catch (error) {
    console.error("Clear All Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear files",
      error: error.message,
    });
  }
};