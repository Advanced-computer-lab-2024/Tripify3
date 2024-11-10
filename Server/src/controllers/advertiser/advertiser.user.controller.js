import User from "../../models/user.js";
import Advertiser from "../../models/advertiser.js";
import Activity from "../../models/activity.js";
import Category from "../../models/category.js";
import mongoose from 'mongoose';


// Update an existing user profile
export const updateProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProfile = await Advertiser.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Get the user profile
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Advertiser.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    // Successful response
    res.status(200).json({ message: "Profile found successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};

// Delete the user profile
export const deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProfile = await Advertiser.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.status(200).json({ message: "Profile deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};

// Create a new activity for the advertiser
export const createActivity = async (req, res) => {
  console.log(req.body);
  try {
    const newActivity = new Activity(req.body);

    await newActivity.save();

    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "Error creating activity", error: error.message });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  const { advertiserId, activityId } = req.params;
  console.log(req.body);
  console.log(advertiserId);
  console.log(activityId);

  try {
    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: activityId, advertiser: advertiserId }, // Ensure consistency with "advertiser"
      { $set: req.body },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating activity", error: error.message });
  }
};

export const getAllActivitiesByAdvertiser = async (req, res) => {
  const { advertiserId } = req.params;
  console.log(advertiserId);

  try {
    // Find activities and populate category and tag details
    const activities = await Activity.find({ advertiser: advertiserId })
      .populate({ path: "category", select: "name" }) // Populate category name
      .populate({ path: "tags", select: "name" }); // Populate tag names

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error retrieving activities:", error.message); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving activities", error: error.message });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  const { advertiserId, activityId } = req.query;
  console.log(advertiserId);
  console.log(activityId);

  try {
    const deletedActivity = await Activity.findOneAndDelete({ _id: activityId, advertiser: advertiserId });

    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    res.status(200).json({ message: "Activity deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error: error.message });
  }
};

export const getAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find(); // Fetch all advertisers from the database
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisers", error });
  }
};



export const checkUpcomingActivities = async (req, res) => {
  const advertiserId = req.params.advertiserId;  // Use the correct parameter name

  try {
    const upcomingActivities = await Activity.find({
      advertiser: advertiserId,
      date: { $gte: new Date() },
    });

    if (upcomingActivities.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Advertiser cannot be deleted as they have activities with current or future dates.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'No upcoming activities found.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while checking for upcoming activities.' });
  }
};

// Controller to delete advertiser account
export const deleteAdvertiserAccount = async (req, res) => {
  const { advertiserId } = req.params;
  const currentDate = new Date();

  try {
    // Check if the advertiser has any upcoming activities
    const hasUpcomingActivities = await Activity.exists({
      advertiser: advertiserId,
      date: { $gt: currentDate },
    });

    if (hasUpcomingActivities) {
      return res.status(400).json({ message: 'Cannot delete account. You have upcoming activities.' });
    }

    // Delete all activities associated with the advertiser
    await Activity.deleteMany({ advertiser: advertiserId });

    // Delete the advertiser's account
    await Advertiser.findByIdAndDelete(advertiserId);

    res.status(200).json({ message: 'Account and associated activities successfully deleted.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting the account and activities' });
  }
};