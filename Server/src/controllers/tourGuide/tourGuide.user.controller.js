import TourGuide from '../../models/tourGuide.js'; // Import your Tour Guide model
import Itinerary from'../../models/itinerary.js';
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


export const getCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
      // Find the comment based on the ID
      const comment = await Comment.findById(commentId);
      
      // If no comment is found, return a 404 error
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      // Return the comment's content (or the full comment object if needed)
      return res.status(200).json(comment);
  } catch (error) {
      console.error('Error fetching comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
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

export const checkUpcomingItineraries = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentDate = new Date();

    console.log('Current Date:', currentDate); // Log current date for debugging

    // Find itineraries with an end time in the future
    const itineraries = await Itinerary.find({
      tourGuide: userId,
      'timeline.endTime': { $gt: currentDate },
    });

    console.log('Upcoming Itineraries:', itineraries); // Log found itineraries

    const hasUpcomingItineraries = itineraries.length > 0;

    res.status(200).json({ hasUpcoming: hasUpcomingItineraries });
  } catch (error) {
    console.error('Error checking itineraries:', error);
    res.status(500).json({ message: 'An error occurred while checking for upcoming itineraries' });
  }
};





export const deleteTourGuideAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentDate = new Date();

    // Check for upcoming itineraries before deletion
    const hasUpcomingItineraries = await Itinerary.exists({
      tourGuide: userId,
      'timeline.endTime': { $gt: currentDate },
    });

    if (hasUpcomingItineraries) {
      return res.status(400).json({ message: 'Cannot delete account. You have upcoming itineraries.' });
    }

    // Proceed to delete the tour guide's account
    await TourGuide.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Account successfully deleted.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting the account' });
  }
};

