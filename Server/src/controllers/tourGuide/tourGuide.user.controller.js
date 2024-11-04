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


// Get Tour Guide Profile by ID
export const getTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from request params
    const profile = await TourGuide.findById(id); // Find tour guide by ID

    if (!profile) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    return res.status(200).json({
      message: "User Profile found successfully",
      userProfile: profile,
    });
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


export const getAllItinerariesByTourGuideId = async (req, res) => {
  try {
      const { id } = req.params; // Extract tour guide ID from request parameters
      
      // Find the tour guide by ID and populate the itineraries
      const tourGuide = await TourGuide.findById(id).populate("itineraries");

      // If tour guide is not found, return 404
      if (!tourGuide) {
          return res.status(404).json({ message: "Tour Guide not found" });
      }

      // Return the itineraries of the found tour guide
      return res.status(200).json(tourGuide.itineraries);
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: "Server error", error: error.message });
  }
};
