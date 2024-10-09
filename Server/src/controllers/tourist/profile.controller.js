import Tourist from "../../models/tourist.js";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await Tourist.findById(userId );

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile found successfully",
      userProfile: userProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const editProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming username is passed as a route parameter
      const { phoneNumber, birthDate, occupation,  nationality, name } = req.body;
  
      // Create an update object and only include fields that are provided in the request body
      const updateData = {};
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (birthDate) updateData.birthDate = birthDate;
      if (occupation) updateData.occupation = occupation;
      if (nationality) updateData.nationality = nationality;
      if (name) updateData.name = name;
  
      // Find the user by username and update only the fields provided in updateData
      const updatedUserProfile = await Tourist.findOneAndUpdate(
        { _id: userId }, // Query by username
        { $set: updateData }, // Update only the fields that are in updateData
        { new: true, runValidators: true } // Return the updated document and run schema validations
      );
  
      if (!updatedUserProfile) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile updated successfully",
        userProfile: updatedUserProfile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  