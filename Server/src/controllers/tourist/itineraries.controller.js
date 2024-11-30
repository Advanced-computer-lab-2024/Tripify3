import Itinerary from "../../models/itinerary.js";
import Booking from "../../models/booking.js";
import Tourist from "../../models/tourist.js";
import mongoose from "mongoose";

export const getSortedItineraries = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;

    // Build the sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const itineraries = await Itinerary.find().sort(sort);
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredItineraries = async (req, res) => {
  try {
    const { language, tags, budget } = req.query; // Get language, tags, and budget from query parameters

    // Create the filter object
    const filter = {};

    // If language is provided, filter by it (case-insensitive)
    if (language) {
      filter.language = { $regex: new RegExp(language, "i") }; // Case-insensitive search for language
    }

    // If tags are provided and it's an array, filter itineraries that have activities containing these tags
    if (tags && Array.isArray(tags)) {
      const tagObjectIds = tags.map((tag) => {
        if (!mongoose.Types.ObjectId.isValid(tag)) {
          return res.status(400).json({ message: `Invalid tag ID: ${tag}` });
        }
        return new mongoose.Types.ObjectId(tag); // Convert each tag to ObjectId
      });

      // Add the tag filter on activities' tags
      filter["activities.tags"] = { $in: tagObjectIds };
    }

    // If budget is provided, filter itineraries with budget less than or equal to the input
    if (budget) {
      const budgetValue = Number(budget); // Convert budget to a number
      if (isNaN(budgetValue)) {
        return res.status(400).json({ message: "Invalid budget value" });
      }
      filter.budget = { $lte: budgetValue }; // Add budget filter
    }

    // Find itineraries and populate activities and tags
    let itineraries = await Itinerary.find(filter)
      .populate({
        path: "activities",
        populate: { path: "tags", select: "_id name" }, // Populate tags inside activities
      })
      .populate("locations tags"); // Optionally populate other fields like locations and itinerary-level tags

 
    return res.status(200).json(itineraries);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const bookItinerary = async (req, res) => {
  const { itineraryId} = req.params;
  const { touristId, totalPrice } = req.body;

  try {
    // Find the Itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);

    if (!activity) {
      return res.status(404).json({ message: "Itinerary not found" });
    }


    // Create a new booking
    const booking = new Booking({
      tourist: touristId,
      price: totalPrice,
    });

    await booking.save();
    itinerary.bookings.push(booking._id);
    await itinerary.save();

    res.status(201).json({
      message: "itinerary booked successfully",
      booking: booking,
    });
    res.status(201).json({ booking: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const updateItinerariesAttended = async (req, res) => {
  const { touristId, itineraryId } = req.body; // Expect `touristId` and `itineraryId` in the request body

  try {
    // Validate input
    if (!touristId || !itineraryId) {
      return res.status(400).json({ message: 'Tourist ID and Itinerary ID are required.' });
    }

    // Find the itinerary to get the tour guide ID
    const itinerary = await Itinerary.findById(itineraryId).select('tourGuide');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    const tourGuideId = itinerary.tourGuide;

    // Update the Tourist's itinerariesAttended array
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { 
        $addToSet: { itinerariesAttended: itineraryId, following: tourGuideId } // Use $addToSet to avoid duplicates
      },
      { new: true } // Return the updated document
    );

    // Check if tourist was found
    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Respond with the updated tourist data
    return res.status(200).json(updatedTourist);
  } catch (error) {
    console.error('Error updating itineraries attended:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};