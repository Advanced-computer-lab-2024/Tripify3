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
    const { id: tourGuideId } = req.params;

    if (!tourGuideId) {
      return res.status(400).json({ message: "Tour guide ID is required." });
    }

    const itineraries = await Itinerary.find({ tourGuide: tourGuideId });

    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No itineraries found for this tour guide." });
    }

    const result = [];
    const allDistinctTourists = new Set();

    for (let itinerary of itineraries) {
      const paidBookings = await Booking.aggregate([
        { $match: { itinerary: itinerary._id, paymentStatus: "Paid" } },
        { $group: { _id: "$tourist" } },
        { $count: "distinctUsers" }
      ]);

      const revenue = await Booking.aggregate([
        { $match: { itinerary: itinerary._id, paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
      ]);

      const distinctUsersCount = paidBookings.length > 0 ? paidBookings[0].distinctUsers : 0;
      const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

      const distinctTourists = await Booking.aggregate([
        { $match: { itinerary: itinerary._id, paymentStatus: "Paid" } },
        { $group: { _id: "$tourist" } }
      ]);
      distinctTourists.forEach((tourist) => allDistinctTourists.add(tourist._id.toString()));

      const startDate = itinerary.timeline.startTime;
      const startMonth = startDate.toLocaleString("default", { month: "long" });

      const bookingDetails = await Booking.find({ itinerary: itinerary._id, paymentStatus: "Paid" })
        .select("date price")
        .lean();

      const formattedBookings = bookingDetails.map((booking) => {
        const bookingDate = new Date(booking.date);
        const month = bookingDate.toLocaleString("default", { month: "long" });
        const day = bookingDate.getDate();
        return {
          date: bookingDate,
          month,
          day,
          amount: booking.price // Include payment amount
        };
      });

      result.push({
        itineraryName: itinerary.name,
        numberOfBookings: bookingDetails.length,
        revenueFromItinerary: totalRevenue,
        distinctUsersCount,
        startDate: startDate,
        startMonth: startMonth,
        bookingDetails: formattedBookings,
      });
    }

    const totalRevenue = result.reduce((sum, item) => sum + item.revenueFromItinerary, 0);
    const totalDistinctUsers = allDistinctTourists.size;

    res.status(200).json({
      totalRevenue,
      totalDistinctUsers,
      itineraries: result,
    });
  } catch (error) {
    console.error("Error fetching paid itineraries and revenue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

