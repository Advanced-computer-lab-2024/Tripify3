import Users from "../models/users.js";

// Create a new user profile
export const createProfile = async (req, res) => {
  const { name, username, email, password, type, details } = req.body;

  try {
    const existingProfile = await Users.findOne({ username });

    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists." });
    }

    const newProfile = new Users({
      name,
      username,
      email,
      password,
      type,
      details,
    });

    await newProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating profile", error: error.message });
  }
};

// Update an existing user profile
export const updateProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const updatedProfile = await Users.findOneAndUpdate({ username }, { $set: { ...req.body, details: details || {} } }, { new: true });

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
  const { username } = req.params;

  try {
    const profile = await Users.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};

// Delete the user profile
export const deleteProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const deletedProfile = await Users.findOneAndDelete({ username });

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
