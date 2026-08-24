import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "campusfix_complaints",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1000, crop: "limit" }],
    },
  });
} else {
  // Fallback to memory storage when Cloudinary is not configured
  storage = multer.memoryStorage();
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

export default upload;
