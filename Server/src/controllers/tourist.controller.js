import crypto from "crypto";
import user from "../models/users.js";
import tourist from "../models/tourist.js";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const userProfile = tourist.find({ username });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile found successfully",
      userProfile: userProfile,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
