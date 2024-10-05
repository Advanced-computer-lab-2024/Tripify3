import crypto from "crypto";
import Seller from "../models/seller.js";
import Advertiser from "../models/advertiser.js";
import TourGuide from "../models/tourGuide.js";
import User from "../models/user.js"; // Assuming this is the User model
import Tourist from "../models/tourist.js"; // Importing the Tourist model (similar for other types)
import { sendPasswordResetEmail } from "../middlewares/sendEmail.middleware.js";

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
    if (existingUsername || existingEmail) {
      return res.status(400).json({ message: "Username or Email already exists." });
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
    } else if (type === "Tourism Governor") {
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
