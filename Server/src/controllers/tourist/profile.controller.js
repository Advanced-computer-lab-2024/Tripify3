import Tourist from "../../models/tourist.js";
import User from "../../models/user.js";
import Seller from "../../models/seller.js";
import Advertiser from "../../models/advertiser.js";
import TourGuide from "../../models/tourGuide.js";
import mongoose from "mongoose";


export const redeemPoints = async (req, res) => {
  try {
      const { id } = req.params; // User ID
      const { pointsToRedeem } = req.body; // Points to redeem

      const userProfile = await Tourist.findById(id);

      if (!userProfile) {
          return res.status(404).json({ message: "User not found" });
      }

      if (pointsToRedeem > userProfile.loyaltyPoints) {
          return res.status(400).json({ message: "Not enough loyalty points" });
      }

      // Calculate cash amount
      const points = pointsToRedeem - (pointsToRedeem % 10000);
      const cashAmount = Math.floor(points / 100); // 10,000 points = 100 EGP
      userProfile.loyaltyPoints -= points;
      userProfile.walletAmount += cashAmount;

      await userProfile.save(); // Save the updated profile

      res.status(200).json({
          message: "Points redeemed successfully",
          userProfile: userProfile, // Return updated user profile
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const userProfile = await Tourist.findById(id);

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
    const { id } = req.params; // User ID from the route parameter
    const { username, email, ...updateData } = req.body; // Destructure to separate username and email

    // First, find the user to determine their type
    const currentUser = await User.findById(id); // Assuming User is your main user model

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine which model to update based on user type
    let updatedUserProfile;
    
    // Exclude username and email for all types except Admin and Tourism Governor
    if (currentUser.type !== "Admin" && currentUser.type !== "Tourism Governor") {
      delete updateData.username;
      delete updateData.email;
    } else {
      // For Admin and Tourism Governor, check if the email already exists if it is being updated
      if (email && email !== currentUser.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
    }

    // Determine which model to update based on user type
    switch (currentUser.type) {
      case "Tourist":
        updatedUserProfile = await Tourist.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      case "Seller":
        updatedUserProfile = await Seller.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      case "Advertiser":
        updatedUserProfile = await Advertiser.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      case "Tour Guide":
        updatedUserProfile = await TourGuide.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      case "Admin":
      case "Tourism Governor":
        updatedUserProfile = await User.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    if (!updatedUserProfile) {
      return res.status(404).json({ message: "Profile not found" });
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

