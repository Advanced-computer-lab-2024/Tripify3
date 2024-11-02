import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Retrieve the user ID from the request
    const userId = req.body.userId || req.headers["user-id"]; // Access userId from headers
    if (!userId) {
      return cb(new Error("User ID is not provided"), null);
    }

    // Create a directory for the user's uploads
    const userUploadDir = path.join(uploadsDir, userId.toString());

    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    cb(null, userUploadDir); // Set the destination to the user's upload directory
  },
  filename: function (req, file, cb) {
    // Save the file with its original name
    cb(null, file.originalname); // Use the original filename for uploads
  },
});

export const upload = multer({ storage });
