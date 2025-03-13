import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import { isAuthenticated } from "../utils/jwt.js";
const router = express.Router();

router.post("/upload-video", isAuthenticated, upload.single("videoFile"), async (req, res) => {
  try {
    const response = await uploadMedia(req.file.path);
    return res
      .status(200)
      .json({ message: "Video uploaded successfully", response: response });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload video" });
  }
});

export default router;