// Import necessary models
import User from "../../models/user.js";
import Advertiser from "../../models/advertiser.js";
import Seller from "../../models/seller.js";
import TourGuide from "../../models/tourGuide.js";
import { upload } from "../../middlewares/multer.middleware.js"; // Adjust path based on your structure
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Tourist from "../../models/tourist.js";

// Define __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, '../../uploads'); // Ensure this path is set correctly

// Retrieve files associated with a user by their ID
export const getUserFilesById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let files;

    // Determine the user's type and fetch files accordingly
    switch (user.type) {
      case "Advertiser":
        const advertiser = await Advertiser.findById(userId);
        files = advertiser ? advertiser.files : [];
        break;
      case "Seller":
        const seller = await Seller.findById(userId);
        files = seller ? seller.files : [];
        break;
      case "Tour Guide":
        const tourGuide = await TourGuide.findById(userId);
        files = tourGuide ? tourGuide.files : [];
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Serve file download
export const downloadFile = (req, res) => {
  const { filePath } = req.params;

  const absolutePath = path.resolve(filePath); // Get absolute path of the file
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(absolutePath); // Send the file for download
  });
};

// In-memory storage to simulate a database for demo purposes (replace with your DB logic)
const userFilesMap = new Map(); // Key: userId, Value: Array of uploaded files

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      console.error('No file path provided for deletion.');
      return reject(new Error('No file path provided.'));
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file at ${filePath}:`, err.message);
        return reject(err);
      }
      console.log(`File deleted successfully at ${filePath}`);
      resolve();
    });
  });
};


export const deleteProfilePicture = async (req, res) => {
  try {
    // Get the userId from the request
    const userId = req.body.userId ;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the user and determine the user type
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userType = user.type; // Assuming 'type' field exists in User model
    let userModel;

    // Set the user model based on type
    switch (userType) {
      case "Seller":
        userModel = Seller;
        break;
      case "Advertiser":
        userModel = Advertiser;
        break;
      case "Tour Guide":
        userModel = TourGuide;
        break;
      case "Tourist":
        userModel = Tourist;
        break;
      default:
        return res.status(400).json({ message: "Unsupported user type." });
    }

    // Find the user's profile picture data
    const existingUser = await userModel.findById(userId).select("profilePicture").exec();
    const existingProfilePicture = existingUser?.profilePicture;

    // If a profile picture exists, delete the file and remove the database record
    if (existingProfilePicture && existingProfilePicture.filepath) {

      console.log(existingProfilePicture.filepath);
      
  
        await deleteFile(existingProfilePicture.filepath);
      

      // Remove profile picture data from the database
      await userModel.findByIdAndUpdate(userId, { profilePicture: null }, { new: true, useFindAndModify: false });

      return res.status(200).json({ message: "Profile picture deleted successfully." });
    } else {
      return res.status(404).json({ message: "No profile picture found to delete." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting profile picture", error: err.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    // Ensure userId is present
    const userId = req.body.userId;
    console.log(req.body);
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Ensure a file is uploaded
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const file = req.files.file;

    

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get the user type
    const userType = user.type; // Assuming 'type' field exists in User model

    // Determine the user model based on user type
    let userModel;
    if (userType === "Seller") {
      userModel = Seller;
    } else if (userType === "Advertiser") {
      userModel = Advertiser;
    } else if (userType === "Tour Guide") {
      userModel = TourGuide;
    } else if (userType === "Tourist") {
      userModel = Tourist;
    } else {
      return res.status(400).json({ message: "Unsupported user type." });
    }

    // Find the user's existing profile picture
    const existingUser = await userModel.findById(userId).select("profilePicture").exec();
    const existingProfilePicture = existingUser?.profilePicture;

      // Ensure the filepath is defined before attempting to delete
      if (existingProfilePicture && existingProfilePicture.filepath) {
        console.log(`Checking file existence at: ${existingProfilePicture.filepath}`);
        const exists = fs.existsSync(existingProfilePicture.filepath);
        console.log(`File exists: ${exists}`);
        if (exists) {
          await deleteFile(existingProfilePicture.filepath);
        }
      } else {
        console.warn('No existing profile picture to delete.');
      }

    
    const profilePictureData = {
      filename: file[0].originalname, // Use `file[0]` if it's an array
      filepath: path.resolve(file[0].path), // Construct path if undefined
      uploadedAt: new Date().toISOString(),
    };

    // Update the user's profile picture in the database
    await userModel.findByIdAndUpdate(userId, { profilePicture: profilePictureData }, { new: true, useFindAndModify: false });

    res.status(200).json({
      message: "Profile picture uploaded successfully!",
      profilePicture: profilePictureData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading profile picture", error: err.message });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    // Ensure userId is present
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Ensure files are present
    if (!req.files || !req.files.files) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get the user type
    const userType = user.type; // Assuming 'type' field exists in User model

    // Prepare an array to hold file details
    const uploadedFiles = [];

    // Check for duplicate file names in the incoming array
    const fileNames = req.files.files.map((file) => file.originalname);
    const duplicateFileNames = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);

    if (duplicateFileNames.length > 0) {
      return res.status(400).json({ message: `Duplicate file names detected: ${duplicateFileNames.join(", ")}` });
    }

    // Fetch existing files from the database to check for duplicates
    let existingFiles = [];
    if (userType === "Seller") {
      existingFiles = await Seller.findById(userId).select("files.filename").exec();
    } else if (userType === "Advertiser") {
      existingFiles = await Advertiser.findById(userId).select("files.filename").exec();
    } else if (userType === "Tour Guide") {
      existingFiles = await TourGuide.findById(userId).select("files.filename").exec();
    }

    // Extract existing file names
    const existingFileNames = existingFiles?.files.map((file) => file.filename) || [];

    // Check for any name collisions
    const collidingFileNames = fileNames.filter((name) => existingFileNames.includes(name));

    if (collidingFileNames.length > 0) {
      return res.status(400).json({ message: `Files with these names already exist: ${collidingFileNames.join(", ")}` });
    }

    // Handle uploaded files
    for (const file of req.files.files) {
      // Construct the file data
      const fileData = {
        filename: file.originalname,
        filepath: path.resolve(file.path), // Get the absolute path of the file
        uploadedAt: new Date().toISOString(),
      };

      // Save file data based on user type
      if (userType === "Seller") {
        // Save to Seller model
        await Seller.findByIdAndUpdate(
          userId,
          { $push: { files: fileData } }, // Use $push to add the new file data
          { new: true, useFindAndModify: false }
        );
      } else if (userType === "Advertiser") {
        await Advertiser.findByIdAndUpdate(
          userId,
          { $push: { files: fileData } }, // Use $push to add the new file data
          { new: true, useFindAndModify: false }
        );
      } else if (userType === "Tour Guide") {
        await TourGuide.findByIdAndUpdate(
          userId,
          { $push: { files: fileData } }, // Use $push to add the new file data
          { new: true, useFindAndModify: false }
        );
      }

      // Push to the uploaded files array
      uploadedFiles.push(fileData);
    }

    res.status(200).json({
      message: "Files uploaded successfully!",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading files", error: err.message });
  }
};

export const getUploadedFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let files = [];
    if (user.type === "Seller") {
      const seller = await Seller.findById(userId).select("files");
      files = seller ? seller.files : [];
    } else if (user.type === "Advertiser") {
      const advertiser = await Advertiser.findById(userId).select("files");
      files = advertiser ? advertiser.files : [];
    } else if (user.type === "Tour Guide") {
      const tourGuide = await TourGuide.findById(userId).select("files");
      files = tourGuide ? tourGuide.files : [];
    }

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found for this user." });
    }

    // Map files to include URLs
    const fileUrls = files.map((file) => ({
      filename: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${userId}/${file.filename}`, // File URL
    }));

    res.status(200).json(fileUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching files", error: err.message });
  }
};


export const getProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by ID to check if they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize an empty profilePicture object
    let profilePicture = null;

    // Check the user type and retrieve the profile picture
    if (user.type === "Seller") {
      const seller = await Seller.findById(userId).select("profilePicture");
      profilePicture = seller ? seller.profilePicture : null;
    } else if (user.type === "Advertiser") {
      const advertiser = await Advertiser.findById(userId).select("profilePicture");
      profilePicture = advertiser ? advertiser.profilePicture : null;
    } else if (user.type === "Tourist") {
      const tourist = await Tourist.findById(userId).select("profilePicture");
      profilePicture = tourist ? tourist.profilePicture : null;
    } else if (user.type === "Tour Guide") {
      const tourGuide = await TourGuide.findById(userId).select("profilePicture");
      profilePicture = tourGuide ? tourGuide.profilePicture : null;
    }

    // Check if profile picture exists
    if (!profilePicture || !profilePicture.filepath) {
      return res.status(404).json({ message: "No profile picture found for this user." });
    }

    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${userId}/${profilePicture.filename}`;

    res.status(200).json({
      filename: profilePicture.filename,
      filepath: profilePicture.filepath,
      url: fileUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile picture", error: err.message });
  }
};


export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
      // Fetch the user by ID without restricting fields
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Respond with the user's name only
      res.status(200).json({user }); // You can include the full user object if needed
  } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};