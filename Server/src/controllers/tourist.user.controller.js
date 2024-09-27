import crypto from "crypto";
import tourist from "../models/tourist.js"; // Adjust the path as necessary
import nodemailer from "nodemailer";

// Store verification codes temporarily
const verificationCodes = new Map();

// Step 1: Send verification code to tourist's email
export const sendVerificationCode = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the tourist by username
    const user = await tourist.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random verification code
    const verificationCode = crypto.randomInt(100000, 999999);

    // Store the code with its expiration time (5 minutes)
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    verificationCodes.set(username, { code: verificationCode, expires: expirationTime });

    // Set up email transport (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "samirelbatal0@gmail.com",
        pass: "epysliporadqknjz",
      },
    });

    const mailOptions = {
      from: "samirelbatal0@gmail.com",
      to: user.email,
      subject: "Password Reset Verification",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { username, verificationCode } = req.body;

    // Check if the code is valid
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

    const user = await tourist.findOne({ username });
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
    const { name, email, dateOfBirth, phoneNumber, username, nationality, password, occupation } = req.body;

    const existingUser = await tourist.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newTourist = new tourist({
      name,
      username,
      email,
      dateOfBirth,
      phoneNumber,
      nationality,
      password,
      occupation,
    });

    // Save the user to the database
    await newTourist.save();

    // Respond with success message and user data
    res.status(201).json({ message: "User created successfully", user: newTourist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find the user by username
    const user = await tourist.findOne({ username });
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
