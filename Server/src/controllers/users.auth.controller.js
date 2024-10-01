import crypto from "crypto";
import user from "../models/users.js";
import tourist from "../models/tourist.js";
import tourGuide from "../models/tourGuide.js";
import mongoose from "mongoose";
import { sendPasswordResetEmail } from "../middlewares/sendEmail.middleware.js";

const verificationCodes = new Map();

export const sendVerificationCode = async (req, res) => {
  try {
    const { username } = req.body;

    const currentUser = await user.findOne({ username });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    const expirationTime = Date.now() + 5 * 60 * 1000; 
    verificationCodes.set(username, { code: verificationCode, expires: expirationTime });

    await sendPasswordResetEmail(currentUser, verificationCode);

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyVerificationCode = async (req, res) => {
  try {
    const { username, verificationCode } = req.body;

    const storedData = verificationCodes.get(username);

    if (!storedData || storedData.code !== parseInt(verificationCode, 10) || Date.now() > storedData.expires) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    verificationCodes.delete(username);

    res.status(200).json({ message: "Verification code entered correctly." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const currentUser = await user.findOne({ username });
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

    const currentUser = await user.findOne({ username });
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
    const { name, email, username, password, type, phoneNumber, nationality, dateOfBirth, occupation } = req.body;

    const existingUsername = await user.findOne({ username });
    const existingEmail = await user.findOne({ email });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Based on the user type, create the respective user
    let newUser;

    if (type === "tourist") {
      newUser = new tourist({
        userId: new mongoose.Types.ObjectId().toString(),
        name,
        username,
        email,
        password, // Be sure to hash this before saving in a real-world scenario
        type,
        phoneNumber,
        nationality,
        dateOfBirth,
        occupation,
      });
    } else if (type === "tourGuide") {
      newUser = new tourGuide({
        userId: new mongoose.Types.ObjectId().toString(),
        username,
        email,
        password, // Be sure to hash this before saving in a real-world scenario
        type,
      });
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
    const currentUser = await user.findOne({ username });
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
