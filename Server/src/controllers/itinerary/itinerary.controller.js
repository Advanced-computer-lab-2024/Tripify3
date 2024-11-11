import Itinerary from "../../models/itinerary.js";
import User from "../../models/user.js";
import Tag from "../../models/user.js";
import TourGuide from "../../models/tourGuide.js";
import Activity from "../../models/activity.js";
import Place from "../../models/place.js";
import Review from "../../models/review.js"; 
import Booking from "../../models/booking.js"; 
import mongoose from "mongoose"; 
import { sendFlagNotificationEmail, sendContentRestoredNotificationEmail } from "../../middlewares/sendEmail.middleware.js";
// Edit itinerary inappropriate attribute


export const editItineraryAttribute = async (req, res) => {
  const { id } = req.params; // Get itinerary ID from request parameters
  const { inappropriate } = req.body; // Get new value for inappropriate from request body

  // Validate the inappropriate value
  if (typeof inappropriate !== "boolean") {
    return res.status(400).json({ message: "Inappropriate field must be a boolean value" });
  }

  try {
    // Find the itinerary and populate the tourGuide field
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      { inappropriate }, // Set the new value for inappropriate
      { new: true, runValidators: true } // Return the updated document and run validation
    ).populate("tourGuide"); // Populate the tourGuide field

    // Check if the itinerary was found
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Send notification email to the tour guide
    if (updatedItinerary.inappropriate) {
      const tourGuide = updatedItinerary.tourGuide;
      await sendFlagNotificationEmail(tourGuide, updatedItinerary.name, "Itinerary");
    } else{
      const tourGuide = updatedItinerary.tourGuide;
      await sendContentRestoredNotificationEmail(tourGuide, updatedItinerary.name, "Itinerary");
    }

    res.status(200).json(updatedItinerary); // Return the updated itinerary
  } catch (error) {
    console.error("Error updating itinerary:", error);
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

export const createItinerary = async (req, res) => {
  try {
    const { tourGuide, activities, places } = req.body;

    // Validate and check if tour guide exists
    if (!mongoose.Types.ObjectId.isValid(tourGuide)) {
      return res.status(400).json({ message: "Invalid tour guide ID format" });
    }
    const tourGuideExists = await TourGuide.exists({ _id: tourGuide });
    if (!tourGuideExists) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Validate and check if all activities exist
    const invalidActivities = activities.some(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidActivities) {
      return res.status(400).json({ message: "One or more activity IDs have an invalid format" });
    }
    const activityChecks = await Promise.all(activities.map(id => Activity.exists({ _id: id })));
    const missingActivity = activityChecks.some(exists => !exists);
    if (missingActivity) {
      return res.status(404).json({ message: "One or more activities not found" });
    }

    // Validate and check if all places exist
    const invalidPlaces = places.some(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidPlaces) {
      return res.status(400).json({ message: "One or more place IDs have an invalid format" });
    }
    const placeChecks = await Promise.all(places.map(id => Place.exists({ _id: id })));
    const missingPlace = placeChecks.some(exists => !exists);
    if (missingPlace) {
      return res.status(404).json({ message: "One or more places not found" });
    }

    // If all checks pass, create the itinerary
    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};


export const getAllItineraries = async (req, res) => {
  try {
    const currentDate = new Date(); // Define currentDate as the current date and time

    const itineraries = await Itinerary.find({
      isDeleted: false,
      "timeline.startTime": { $gt: currentDate },
    })
      .populate({
        path: "activities",
        populate: {
          path: "tags", // Populate the tags within activities
          select: "name", // Select only the 'name' field of the tags
        },
      })
      .populate({
        path: "places",
        populate: {
          path: "tags", // Populate the tags within locations
          select: "name", // Select only the 'name' field of the tags
        },
      });

    // Transform the itineraries to include a combined tags array
    let response = itineraries.map((itinerary) => {
      // Extract tags from activities
      const activityTags = itinerary.activities.flatMap((activity) => activity.tags.map((tag) => tag.name));
      // Extract tags from locations
      const locationTags = itinerary.places.flatMap((location) => location.tags.map((tag) => tag.name));

      // Combine activity and location tags into one array
      const combinedTags = [...new Set([...activityTags, ...locationTags])]; // Remove duplicates with Set

      return {
        ...itinerary.toObject(), // Convert Mongoose document to plain object
        tags: combinedTags, // Add combined tags array to the itinerary
      };
    });

    return res.status(200).json({
      message: "Iteneraries found successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllActiveAppropriateItineraries = async (req, res) => {
  try {
    const currentDate = new Date(); // Define currentDate as the current date and time

    const itineraries = await Itinerary.find({ status: "Active", inappropriate: false, isDeleted: false,
      "timeline.startTime": { $gt: currentDate } })
      .populate({
        path: "activities",
        populate: {
          path: "tags",
          select: "name",
        },
      })
      .populate({
        path: "places",
        populate: {
          path: "tags",
          select: "name",
        },
      });

    // Transform the itineraries to include a combined tags array
    let response = itineraries.map((itinerary) => {
      const activityTags = itinerary.activities.flatMap((activity) => activity.tags.map((tag) => tag.name));
      const locationTags = itinerary.places.flatMap((location) => location.tags.map((tag) => tag.name));
      const combinedTags = [...new Set([...activityTags, ...locationTags])];

      return {
        ...itinerary.toObject(),
        tags: combinedTags,
      };
    });

    return res.status(200).json({
      message: "Itineraries found successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllItinerariesForTourGuide = async (req, res) => {
  const { id } = req.params;
  try {
    const currentDate = new Date(); // Define currentDate as the current date and time

    // Find the tour guide's itineraries directly from the Itinerary model
    const itineraries = await Itinerary.find({ tourGuide: id ,isDeleted: false,
      "timeline.endTime": { $gt: currentDate } })
      .populate({
        path: "activities",
        populate: {
          path: "tags", // Populate the tags within activities
          select: "name", // Select only the 'name' field of the tags
        },
      })
      .populate({
        path: "places",
        populate: {
          path: "tags", // Populate the tags within locations
          select: "name", // Select only the 'name' field of the tags
        },
      });

    // Check if no itineraries were found
    if (itineraries.length === 0) {
      return res.status(200).json({
        message: "No itineraries found for this tour guide",
        data: [], // Return an empty array for consistency
      });
    }

    // Transform the itineraries to include a combined tags array
    let response = itineraries.map((itinerary) => {
      // Extract tags from activities
      const activityTags = itinerary.activities.flatMap((activity) => activity.tags.map((tag) => tag.name));
      // Extract tags from locations
      const locationTags = itinerary.places.flatMap((location) => location.tags.map((tag) => tag.name));

      // Combine activity and location tags into one array
      const combinedTags = [...new Set([...activityTags, ...locationTags])]; // Remove duplicates with Set

      return {
        ...itinerary.toObject(), // Convert Mongoose document to plain object
        tags: combinedTags, // Add combined tags array to the itinerary
      };
    });

    // Assuming 'user' variable is not needed anymore (as you no longer need to filter by user type)
    const user = await User.findById(id);
    if (user && user.type === "Tourist") {
      // Filter itineraries for tourists to exclude inappropriate ones
      response = response.filter((itinerary) => !itinerary.inappropriate);
    }

    return res.status(200).json({
      message: "Itineraries found successfully",
      data: response, // Return the itineraries data
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get an itinerary by ID
export const getItineraryById = async (req, res) => {
  try {
    const id = req.params.id;
    const itinerary = await Itinerary.findById(id).populate("activities").populate("places").populate("tags").populate("tourGuide");
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const reviews = await Review.find({ itinerary: id }).populate("tourist", "username").select("rating comment tourist"); // Select only the fields we need

    return res.status(200).json({
      message: "Itenerary found successfully",
      data: { itinerary, reviews },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an itinerary by ID
export const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an itinerary by ID
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if there are bookings associated with this itinerary
    // if (itinerary.bookings.length > 0) {
    //   return res.status(400).json({ message: "Cannot delete an itinerary with existing bookings" });
    // }

    // Mark the activity as deleted
    itinerary.isDeleted = true;

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addActivityToItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { activityId } = req.body; // Expecting activityId to be sent

    // Find the itinerary by ID and push the activityId to the activities array
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      { $push: { activities: activityId } }, // Ensure activities is an array of ObjectIds
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).send({ message: "Itinerary not found" });
    }

    res.status(200).send(updatedItinerary);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

export const ActivateItinerary = async (req, res) => {
  const itineraryId = req.params.id;

  try {
    // Find if there are any bookings with this itinerary
    const bookings = await Booking.find({ itinerary: itineraryId });

    if (bookings.length === 0) {
      return res.status(400).json({ message: "Itinerary has no bookings, cannot be activated" });
    }

    // Now find the itinerary based on its ID
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.status === "Active") {
      return res.status(400).json({ message: "Itinerary is already active" });
    }

    itinerary.status = "Active";
    await itinerary.save();

    res.status(200).json({ message: "Itinerary activated successfully", itinerary });
  } catch (error) {
    res.status(500).json({ message: "Error activating itinerary", error });
  }
};

// Deactivate Itinerary
export const DeactivateItinerary = async (req, res) => {
  const itineraryId = req.params.id;

  try {
    console.log("Attempting to find itinerary with ID:", itineraryId);

    // Find if there are any bookings with this itinerary
    const bookings = await Booking.find({ itinerary: itineraryId });
    console.log("Bookings found:", bookings);

    if (bookings.length === 0) {
      return res.status(400).json({ message: "Itinerary with no bookings cannot be deactivated" });
    }

    // Now find the itinerary based on its ID
    const itinerary = await Itinerary.findById(itineraryId);
    console.log("Found itinerary:", itinerary);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.status === "Inactive") {
      return res.status(400).json({ message: "Itinerary is already inactive" });
    }

    itinerary.status = "Inactive";
    await itinerary.save();

    res.status(200).json({ message: "Itinerary deactivated successfully", itinerary });
  } catch (error) {
    console.error("Error deactivating itinerary:", error);
    res.status(500).json({ message: "Error deactivating itinerary", error: error.message || error });
  }
};


export const fetchBookingsForItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;

    // Validate itinerary ID format
    if (!mongoose.Types.ObjectId.isValid(itineraryId)) {
      return res.status(400).json({ message: "Invalid itinerary ID format" });
    }

    const bookings = await Booking.find({ itinerary: itineraryId })
      .populate("tourist", "name email")
      .populate("place", "name location")
      .populate("activity", "name description");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this itinerary" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

