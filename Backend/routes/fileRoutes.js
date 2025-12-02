import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getFile,
  deleteFile,
  getAllFiles,
  clearAllFiles,
} from "../controllers/fileController.js";

const router = express.Router();

// Upload file
router.post("/upload", upload.single("file"), uploadFile);

// Get all files
router.get("/files", getAllFiles);

// Get single file
router.get("/files/:fileId", getFile);

// Delete file
router.delete("/files/:fileId", deleteFile);

// Clear all files (use with caution!)
router.delete("/files", clearAllFiles);

export default router;