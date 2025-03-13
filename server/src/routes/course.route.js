import express from "express";
import { isAuthenticated } from "../utils/jwt.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCreatorCourses,
  getSearchedCourses,
  removeCourse,
  togglePublishCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import {
  createLecture,
  getCourseLectures,
  getLecture,
  removeLecture,
  updateLecture,
} from "../controllers/lecture.controller.js";

const courseRouter = express.Router();

courseRouter.route("/published-courses").get(getAllCourses);

courseRouter.route("/search").get(isAuthenticated, getSearchedCourses);

courseRouter
  .route("/")
  .post(isAuthenticated, createCourse)
  .get(isAuthenticated, getCreatorCourses);

courseRouter
  .route("/:courseId")
  .get(isAuthenticated, getCourseById)
  .put(isAuthenticated, upload.single("courseThumbnail"), updateCourse)
  .patch(isAuthenticated, togglePublishCourse)
  .delete(isAuthenticated, removeCourse);

courseRouter
  .route("/:courseId/lecture")
  .post(isAuthenticated, createLecture)
  .get(isAuthenticated, getCourseLectures);

courseRouter
  .route("/:courseId/lecture/:lectureId")
  .get(isAuthenticated, getLecture)
  .post(isAuthenticated, updateLecture);

courseRouter
  .route("/lecture/:lectureId")
  .delete(isAuthenticated, removeLecture);

export default courseRouter;
