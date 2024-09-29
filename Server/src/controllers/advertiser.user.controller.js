import Users from "../models/users.js";

// Create a new user profile
exports.createProfile = async (req, res) => {
  //   if (!name || !username || !password || !type) {
  //     return res.status(400).json({ message: "Required fields are missing" });
  //   }

  try {
    const { name, username, email, password, type, details } = req.body;
    console.log(req.body);
    const existingProfile = await Users.findOne({ username });
    console.log(existingProfile);
    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists." });
    }
    console.log(existingProfile);
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
exports.updateProfile = async (req, res) => {
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
exports.getProfile = async (req, res) => {
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
exports.deleteProfile = async (req, res) => {
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
