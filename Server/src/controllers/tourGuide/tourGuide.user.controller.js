import TourGuide from "../../models/tourGuide.js"; // Import your Tour Guide model
import Itinerary from "../../models/itinerary.js";
import Booking from "../../models/booking.js";

// Update Tour Guide Profile
export const updateTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the tour guide ID is sent in the URL
    const updateData = req.body; // Get the updated profile data from the request body

    // Find the tour guide by ID and update their profile
    const updatedProfile = await TourGuide.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error); // Enhanced error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Tour Guide Profile by ID
export const getTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from request params
    const profile = await TourGuide.findById(id); // Find tour guide by ID

    if (!profile) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    return res.status(200).json({
      message: "User Profile found successfully",
      userProfile: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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


export const deleteTourGuideAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentDate = new Date();

    // Check if the user exists in the TourGuide model
    const tourGuide = await TourGuide.findById(userId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found." });
    }

    // Retrieve all itineraries with endTime > currentDate for this tour guide
    const itineraries = await Itinerary.find({
      tourGuide: userId,
      "timeline.endTime": { $gt: currentDate },
    });

    // Extract itinerary IDs
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    // Check for any bookings with these itinerary IDs
    const hasUpcomingBookings = await Booking.exists({
      itinerary: { $in: itineraryIds },
    });

    if (hasUpcomingBookings) {
      return res.status(403).json({
        message: "Cannot delete account. You have upcoming bookings for your itineraries.",
      });
    }

    // Mark all products associated with the seller as deleted
    await Itinerary.updateMany({ tourGuide: userId }, { $set: { isDeleted: true } });

    // Proceed to delete the tour guide's account
    await TourGuide.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account and associated itineraries successfully deleted." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Error deleting the account and itineraries" });
  }
};

export const getPaidItinerariesAndRevenue = async (req, res) => {
  try {
    // Get the tour guide ID from the request parameters
    const { id: tourGuideId } = req.params;

    if (!tourGuideId) {
      return res.status(400).json({ message: "Tour guide ID is required." });
    }

    // Find itineraries related to the tour guide
    const itineraries = await Itinerary.find({ tourGuide: tourGuideId });

    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No itineraries found for this tour guide." });
    }

    // Extract itinerary IDs
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    // Fetch paid bookings related to the itineraries
    const paidBookings = await Booking.find({
      itinerary: { $in: itineraryIds },
      paymentStatus: "Paid",
    });

    // Calculate total revenue
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + booking.price, 0);

    res.status(200).json({
      numberOfPaidItineraries: paidBookings.length,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching paid itineraries and revenue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
