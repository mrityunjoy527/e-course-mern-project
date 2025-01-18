import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { deletePhotoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 3000);
    });
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(500).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(500).json({ message: "User exists with this email" });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to register" });
  }
};

const loginUser = async (req, res) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 3000);
    });
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Incorrect email or password" });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(500).json({ message: "Incorrect email or password" });
    }
    const token = generateToken(user);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

const logoutUser = async (_, res) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 3000);
    });
    res.clearCookie("token");
    return res
      .status(200)
      .json({
        isLoggedOut: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isLoggedOut: false, message: "Failed to logout" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 3000);
    });
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

const updateProfile = async (req, res) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 3000);
    });
    const userId = req.id;
    const { name } = req.body;
    const photoFile = req.file;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deletePhotoFromCloudinary(publicId);
    }
    const cloudResponse = await uploadMedia(photoFile.path);
    const { secure_url: photoUrl } = cloudResponse;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: name, photoUrl },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export { registerUser, loginUser, logoutUser, getUserProfile, updateProfile };
