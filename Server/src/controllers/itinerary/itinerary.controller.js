import Itinerary from "../../models/itinerary.js";
import User from "../../models/user.js";
import Tag from "../../models/user.js";
import Tourist from "../../models/tourist.js";
import Review from "../../models/review.js";
import Booking from "../../models/booking.js";
import Notification from "../../models/notification.js";
import mongoose from "mongoose";
import { sendItineraryActiveEmail } from "../../middlewares/sendEmail.middleware.js";
import { sendFlagNotificationEmail, sendContentRestoredNotificationEmail } from "../../middlewares/sendEmail.middleware.js";

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

    let notificationMessage;

    // Send notification email to the tour guide
    if (updatedItinerary.inappropriate) {
      const tourGuide = updatedItinerary.tourGuide;
      await sendFlagNotificationEmail(tourGuide, updatedItinerary.name, "Itinerary");

      notificationMessage = `Your itinerary "${updatedItinerary.name}" has been flagged as inappropriate by the admin. It will no longer be visible to tourists. Please review the content and make necessary adjustments. If you believe this is a mistake, feel free to contact support.`;

      // Save the notification in the database
      const notification = new Notification({
        user: tourGuide._id, // Assuming `seller` is the seller's user ID
        message: notificationMessage,
      });

      await notification.save();
    } else {
      const tourGuide = updatedItinerary.tourGuide;
      await sendContentRestoredNotificationEmail(tourGuide, updatedItinerary.name, "Itinerary");

      notificationMessage = `Good news! Your itinerary "${updatedItinerary.name}" has been reviewed and is now deemed appropriate. It is visible to tourists again. Thank you for maintaining quality content!`;

      // Save the notification in the database
      const notification = new Notification({
        user: tourGuide._id, // Assuming `seller` is the seller's user ID
        message: notificationMessage,
      });

      await notification.save();
    }

    res.status(200).json(updatedItinerary); // Return the updated itinerary
  } catch (error) {
    console.error("Error updating itinerary:", error);
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

export const createItinerary = async (req, res) => {
  try {
    const { name, language, pickupLocation, dropoffLocation, startTime, endTime, price, accessibility, timeline, tags, activities, places, tourGuide } = req.body;
    console.log(req.body);
    console.log(req.body.tags);
    const newItinerary = new Itinerary({
      name,
      language,
      pickupLocation,
      dropoffLocation,
      startTime,
      endTime,
      price,
      accessibility,
      timeline,
      tags,
      activities,
      places,
      tourGuide,
    });

    await newItinerary.save();
    res.status(201).json({ message: "Itinerary created successfully", itinerary: newItinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
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
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
      })
      .populate({
        path: "places",
        populate: {
          path: "tags", // Populate the tags within locations
          select: "name", // Select only the 'name' field of the tags
        },
      });

    return res.status(200).json({
      message: "Iteneraries found successfully",
      data: itineraries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllActiveAppropriateItineraries = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1); // Increment the day to get tomorrow's date
    tomorrow.setHours(0, 0, 0, 0); // Set the time to the start of tomorrow (midnight)

    const { userId } = req.params;


    const itineraries = await Itinerary.find({ inappropriate: false, isDeleted: false, "timeline.startTime": { $gt: tomorrow } })
      .populate({
        path: "activities",
        populate: {
          path: "tags",
          select: "name",
        },
      })
      .populate({
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
      })
      .populate({
        path: "places",
        populate: {
          path: "tags",
          select: "name",
        },
      });

    let bookmarkedItineraries = [];
    if (userId) {
      // Fetch the user's bookmarked itineraries
      const tourist = await Tourist.findById(userId).select("userBookmarkedItineraries");
      if (tourist) {
        bookmarkedItineraries = tourist.userBookmarkedItineraries.map((id) => id.toString());
      }
    }

    // Add the `isBookmarked` field to each itinerary
    const itinerariesWithBookmarkStatus = itineraries.map((itinerary) => ({
      ...itinerary.toObject(),
      isBookmarked: bookmarkedItineraries.includes(itinerary._id.toString()),
    }));

    return res.status(200).json({
      message: "Itineraries found successfully",
      data: itinerariesWithBookmarkStatus,
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
    const itineraries = await Itinerary.find({ tourGuide: id, isDeleted: false, "timeline.endTime": { $gt: currentDate } })
      .populate({
        path: "activities",
        populate: {
          path: "tags", // Populate the tags within activities
          select: "name", // Select only the 'name' field of the tags
        },
      })
      .populate({
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
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
    // let response = itineraries.map((itinerary) => {
    //   // Extract tags from activities
    //   const activityTags = itinerary.activities.flatMap((activity) => activity.tags.map((tag) => tag.name));
    //   // Extract tags from locations
    //   const locationTags = itinerary.places.flatMap((location) => location.tags.map((tag) => tag.name));

    //   // Combine activity and location tags into one array
    //   const combinedTags = [...new Set([...activityTags, ...locationTags])]; // Remove duplicates with Set

    //   return {
    //     ...itinerary.toObject(), // Convert Mongoose document to plain object
    //     tags: combinedTags, // Add combined tags array to the itinerary
    //   };
    // });

    // // Assuming 'user' variable is not needed anymore (as you no longer need to filter by user type)
    // const user = await User.findById(id);
    // if (user && user.type === "Tourist") {
    //   // Filter itineraries for tourists to exclude inappropriate ones
    //   response = response.filter((itinerary) => !itinerary.inappropriate);
    // }

    return res.status(200).json({
      message: "Itineraries found successfully",
      data: itineraries, // Return the itineraries data
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
    // Validate the ID parameter
    if (!req.params.id) {
      return res.status(400).json({ message: "Itinerary ID is required" });
    }

    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    console.log("Itinerary found: ", itinerary); // Log the itinerary data

    // Check for bookings associated with the itinerary
    const bookings = await Booking.find({ itinerary: itinerary._id });
    console.log("Bookings found: ", bookings); // Log the bookings data

    // Check if there are bookings and if the end time is in the future
    if (bookings.length > 0 && Date.now() < new Date(itinerary.timeline.endTime)) {
      return res.status(403).json({ message: "Cannot delete an itinerary with bookings and an end time in the future" });
    }

    // Mark itinerary as deleted
    itinerary.isDeleted = true;
    await itinerary.save();
    return res.status(200).json({ message: "Itinerary marked as deleted" });
  } catch (error) {
    // Log the error for debugging
    console.error("Delete itinerary error: ", error);

    // Check if the error is a MongoDB error (for instance, invalid ObjectId format)
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid itinerary ID format" });
    }

    // Handle database connection errors
    if (error.name === "MongoNetworkError") {
      return res.status(500).json({ message: "Database connection error. Please try again later." });
    }

    // Generic server error message
    return res.status(500).json({ message: "An error occurred while deleting the itinerary. Please try again later." });
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

    // if (bookings.length === 0) {
    //   return res.status(400).json({ message: "Itinerary has no bookings, cannot be activated" });
    // }

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

     // Find tourists who have this itinerary in their bookmarks
     const tourists = await Tourist.find({
      userBookmarkedItineraries: itineraryId,
    });

    if (tourists.length > 0) {
         // Iterate over tourists to send emails and create notifications
         const notifications = [];
         for (const tourist of tourists) {
           // Send email to the tourist
           await sendItineraryActiveEmail(
             tourist,
             itinerary.name,
             `http://localhost:3000/tourist/itinerary/${itineraryId}`
           );   
           // Create a notification for the tourist
           notifications.push({
             user: tourist._id,
             message: `The itinerary "${itinerary.name}" you are interested in has been activated and is now available for booking.`,
           });
         }
   
      // Save all notifications to the database
      await Notification.insertMany(notifications);
    }


    res.status(200).json({ message: "Itinerary activated successfully", itinerary });
  } catch (error) {
    console.log(error);
    
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

    const bookings = await Booking.find({ itinerary: itineraryId }).populate("tourist", "name email").populate("place", "name location").populate("activity", "name description");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this itinerary" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
