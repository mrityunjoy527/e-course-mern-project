import express from "express";
import { isAuthenticated } from "../utils/jwt.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInComplete,
  updateCourseProgress,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get("/:courseId", isAuthenticated, getCourseProgress);
router.put("/:courseId/lecture/:lectureId", isAuthenticated, updateCourseProgress);
router.put("/:courseId/completed", isAuthenticated, markAsCompleted);
router.put("/:courseId/incomplete", isAuthenticated, markAsInComplete);

export default router;