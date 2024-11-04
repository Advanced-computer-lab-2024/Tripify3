import crypto from "crypto";
import Seller from "../../models/seller.js";
import Advertiser from "../../models/advertiser.js";
import TourGuide from "../../models/tourGuide.js";
// import Booking from "../../models/booking.js";
import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import User from "../../models/user.js"; // Assuming this is the User model
import Tourist from "../../models/tourist.js"; // Importing the Tourist model (similar for other types)
import { sendPasswordResetEmail } from "../../middlewares/sendEmail.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js"; // Adjust the path accordingly
import { uploadFiles } from "./file.controller.js"; // Import the upload controller

const verificationCodes = new Map();

export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return res.status(404).json({ message: "Email is not linked to any user" });
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    const expirationTime = Date.now() + 5 * 60 * 1000;
    verificationCodes.set(email, { code: verificationCode, expires: expirationTime });

    await sendPasswordResetEmail(currentUser, verificationCode);

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyVerificationCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const storedData = verificationCodes.get(email);

    if (!storedData || storedData.code !== parseInt(verificationCode, 10) || Date.now() > storedData.expires) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    verificationCodes.delete(email);

    res.status(200).json({ message: "Verification code entered correctly." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the password and save it to the database
    currentUser.password = newPassword;
    await currentUser.save();

    res.status(200).json({ message: "Verification code entered correctly." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Check user type and status
    const allowedTypes = ["Seller", "Advertiser", "Tour Guide"];
    if (allowedTypes.includes(currentUser.type) && currentUser.status !== "Accepted") {
      return res.status(403).json({ message: "Your account is not approved for login." });
    }

    console.log(currentUser);

    res.status(200).json({ message: "Login successful", user: currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, type } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    console.log(existingEmail);
    console.log(email);
    console.log(username);

    if (existingUsername && existingEmail) {
      return res.status(400).json({ message: "Username and Email already exists." });
    } else if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    } else if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Based on the user type, create the respective user
    let newUser;

    if (type === "Tourist") {
      newUser = new Tourist(req.body);
    } else if (type === "Tour Guide") {
      newUser = new TourGuide(req.body);
    } else if (type === "Seller") {
      newUser = new Seller(req.body);
    } else if (type === "Advertiser") {
      newUser = new Advertiser(req.body);
    } else if (type === "Admin") {
      newUser = new User(req.body);
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`,
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find the user by username
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the old password matches
    if (currentUser.password !== oldPassword) {
      return res.status(401).json({ message: "Invalid old password." });
    }

    // Ensure new password is different from the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Update the password and save it to the database
    currentUser.password = newPassword;
    await currentUser.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const userAcceptTerms = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find the user by ID and update the `hasAcceptedTerms` field
    const user = await User.findByIdAndUpdate(id, { hasAcceptedTerms: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Terms accepted successfully.", user });
  } catch (error) {
    console.error("Error updating terms acceptance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete account controller
export const userDeleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check user type and get associated entities
    let upcomingBookings = [];
    if (user.type === "Advertiser") {
      // Find all upcoming bookings for activities posted by this advertiser
      const activities = await Activity.find({ advertiser: user._id });
      const activityIds = activities.map(activity => activity._id);

      upcomingBookings = await Booking.find({
        activity: { $in: activityIds },
        date: { $gt: new Date() },
        price: { $gt: 0 } // Only consider bookings that are paid
      });
    } else if (user.type === "Tour Guide") {
      // Find all upcoming bookings for itineraries posted by this tour guide
      const itineraries = await Itinerary.find({ tourGuide: user._id });
      const itineraryIds = itineraries.map(itinerary => itinerary._id);

      upcomingBookings = await Booking.find({
        itinerary: { $in: itineraryIds },
        date: { $gt: new Date() },
        price: { $gt: 0 }
      });
    }

    // If there are upcoming bookings, deny account deletion
    if (upcomingBookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete account with upcoming paid bookings."
      });
    }

    // Soft-delete associated activities/itineraries and set user to inactive
    if (user.type === "Advertiser") {
      await Activity.updateMany({ advertiser: user._id }, { status: "Inactive" });
    } else if (user.type === "Tour Guide") {
      await Itinerary.updateMany({ tourGuideId: user._id }, { status: "Inactive" });
    }

    // Mark user as deleted (soft delete)
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Account deleted successfully and associated records inactivated." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
