import express from "express";
import { isAuthenticated } from "../utils/jwt.js";
import { createCourse } from "../controllers/course.controller.js";

const courseRouter = express.Router();
courseRouter.post("/", isAuthenticated, createCourse);

export default courseRouter;