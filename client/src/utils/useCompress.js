import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      useWebWorker: true,
      maxWidthOrHeight: 800,
    });
    return compressedFile;
  } catch (error) {
    console.error(error);
  }
};

export default compressImage;