import crypto from "crypto";
import Users from "../models/users.js"; // Adjust the path as necessary
import nodemailer from "nodemailer";
import { sendPasswordResetEmail } from "../middlewares/sendEmail.middleware.js";

// Assuming you have user and verificationCode available
try {
  await sendPasswordResetEmail(user, verificationCode);
  // Handle success (e.g., send response back to client)
} catch (error) {
  // Handle error (e.g., send error response back to client)
}


const verificationCodes = new Map();

// Step 1: Send verification code to tourist's email
export const sendVerificationCode = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    verificationCodes.set(username, { code: verificationCode, expires: expirationTime });    

    await sendPasswordResetEmail(user, verificationCode);

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, username, password, type , details } = req.body;

    const existingUser = await Users.findOne({ username });
    const existingEmail = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = new Users({
      name,
      username,
      email,
      password,
      type,
      details,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find the user by username
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the old password matches
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Invalid old password." });
    }

    // Ensure new password is different from the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Update the password and save it to the database
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
