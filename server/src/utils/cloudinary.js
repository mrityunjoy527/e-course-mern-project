import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

const deletePhotoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {resource_type: "image"});
  } catch (error) {
    console.log(error);
  }
};

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {resource_type: "video"});
  } catch (error) {
    console.log(error);
  }
};

export {deletePhotoFromCloudinary, deleteVideoFromCloudinary, uploadMedia}