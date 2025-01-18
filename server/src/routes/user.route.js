import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../utils/jwt.js";
import upload from "../utils/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", logoutUser);

userRouter.get("/profile", isAuthenticated, getUserProfile);

userRouter.put(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateProfile
);

export default userRouter;
