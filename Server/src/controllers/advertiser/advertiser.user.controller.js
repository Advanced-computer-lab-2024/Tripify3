import User from "../../models/user.js";
import Advertiser from "../../models/advertiser.js";
import Activity from "../../models/activity.js";
import Tag from "../../models/tag.js";
import Category from "../../models/category.js";

// Update an existing user profile
export const updateProfile = async (req, res) => {
  const { advertiserId } = req.params;

  try {
    const updatedProfile = await Advertiser.findByIdAndUpdate(advertiserId, { $set: req.body }, { new: true });

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

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find(); // Fetch all tags from the database
    res.status(200).json({
      message: "Tags retrieved successfully",
      tags: tags,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tags", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
};

// Get the user profile
export const getProfile = async (req, res) => {
  const { advertiserId } = req.params;

  try {
    const profile = await Advertiser.findById(advertiserId);

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
  const { advertiserId } = req.params;

  try {
    const deletedProfile = await Advertiser.findByIdAndDelete(advertiserId);

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
  const { advertiserId, categoryId, name, date, time, location, price, tags, specialDiscount, isbooking } = req.body;

  try {
    const newActivity = new Activity({
      advertiserId,
      name,
      date,
      time,
      location,
      price,
      categoryId,
      tags,
      specialDiscount,
      isbooking,
    });

    await newActivity.save();

    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating activity", error: error.message });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  const { advertiserId, activityId } = req.params;

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
    const activities = await Activity.find({ advertiser: advertiserId });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving activities", error: error.message });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  const { advertiserId, activityId } = req.params;

  try {
    const deletedActivity = await Activity.findOneAndDelete({ _id: activityId, advertiser: advertiserId });

    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    res.json({ message: "Activity deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error: error.message });
  }
};

export const getAdvertisers = async (req, res) => {
  try {
      const advertisers = await Advertiser.find(); // Fetch all advertisers from the database
      res.status(200).json(advertisers);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching advertisers', error });
  }
};
