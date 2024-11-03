import TourGuide from '../../models/tourGuide.js'; // Import your Tour Guide model

// Update Tour Guide Profile
export const updateTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the tour guide ID is sent in the URL
    const updateData = req.body; // Get the updated profile data from the request body

    // Find the tour guide by ID and update their profile
    const updatedProfile = await TourGuide.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error); // Enhanced error logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const uploadTourGuidePicture = async (req, res) => {
  try {
    const { id } = req.params; // Get the tour guide ID from the request parameters
    const file = req.file; // Access the uploaded file

    // Check if a file is uploaded
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Optionally, check the file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
    }

    // Use the uploaded file's path
    const picturePath = file.path;

    // Find the tour guide by ID and update the profile picture
    const updatedProfile = await TourGuide.findByIdAndUpdate(
      id,
      { profilePicture: picturePath },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Respond with the updated profile picture information
    res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: updatedProfile.profilePicture });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





// Get Tour Guide Profile by ID
export const getTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from request params
    const profile = await TourGuide.findById(id); // Find tour guide by ID

    if (!profile) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    res.status(200).json(profile); // Return the profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getAllTourGuides = async (req, res) => {
  try {
    const tourGuides = await TourGuide.find(); // Fetch all tour guides
    res.status(200).json(tourGuides); // Return as JSON
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tour guides", error });
  }
};

