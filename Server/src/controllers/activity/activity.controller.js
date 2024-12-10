import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js"; // Assuming you have an Itinerary model
import Tourist from "../../models/tourist.js";
import Review from "../../models/review.js";
import Booking from "../../models/booking.js";
import Notification from "../../models/notification.js";
import { sendActivityActiveEmail } from "../../middlewares/sendEmail.middleware.js";
import mongoose from "mongoose";

export const getAllActivities = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch activities with future dates and populate tag names
    const activities = await Activity.find({ date: { $gt: currentDate }, isDeleted: false })
      .populate({
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
      })
      .populate({
        path: "category", // Populate the category field
        select: "name", // Only retrieve the category's name
      });

    res.status(200).json({ activities: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllActivitiesForTourist = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1); // Increment the day to get tomorrow's date
    tomorrow.setHours(0, 0, 0, 0); // Set the time to the start of tomorrow (midnight)

     const {userId} = req.params;

     console.log(userId);

    // Fetch activities with future dates and populate tag names
    const activities = await Activity.find({ date: { $gt: tomorrow }, isDeleted: false, inappropriate: false, })
      .populate({
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
      })
      .populate({
        path: "category", // Populate the category field
        select: "name", // Only retrieve the category's name
      });

    console.log(activities);

    let bookmarkedActivities = [];
    if (userId) {
      // Fetch the user's bookmarked activities
      const tourist = await Tourist.findById(userId).select("userBookmarkedActivities");
      if (tourist) {
        bookmarkedActivities = tourist.userBookmarkedActivities.map((id) => id.toString());
      }
    }

    // Add the `isBookmarked` field to each activity
    const activitiesWithBookmarkStatus = activities.map((activity) => ({
      ...activity.toObject(),
      isBookmarked: bookmarkedActivities.includes(activity._id.toString()),
    }));

    return res.status(200).json({ activities: activitiesWithBookmarkStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getAllActivitiesForGuest = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1); // Increment the day to get tomorrow's date
    tomorrow.setHours(0, 0, 0, 0); // Set the time to the start of tomorrow (midnight)

    
    // Fetch activities with future dates and populate tag names
    const activities = await Activity.find({ date: { $gt: tomorrow }, isDeleted: false, inappropriate: false,})
      .populate({
        path: "tags", // Populate the tags field
        select: "name", // Only retrieve the tag's name
      })
      .populate({
        path: "category", // Populate the category field
        select: "name", // Only retrieve the category's name
      });
  

    return res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};


// Get a single activity by ID with reviews
export const getActivityById = async (req, res) => {
  try {
    // Fetch the activity by ID, with populated fields for tags, category, and location
    const activity = await Activity.findById(req.params.activityId)
      .populate({ path: "tags", select: "name" }) // Populate tags with their names only
      .populate({ path: "category", select: "name" }) // Populate category with its name only
      .populate("location"); // Assuming location might also be populated if needed

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const reviews = await Review.find({ activity: req.params.activityId }).populate("tourist", "username").select("rating comment tourist"); // Select only the fields we need

    return res.status(200).json({
      message: "Activity found successfully",
      data: { activity, reviews }, // Now the reviews are nested inside the activity object
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mark an activity as deleted after checking if its date is in the future and it has no future bookings
export const deleteActivity = async (req, res) => {
  try {
    // Find the activity by its ID
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Check if the activity date is in the future
    // if (activity.date > new Date()) {
    //   // Check if there are any future bookings for this activity
    //   const futureBookings = await Booking.find({
    //     activity: req.params.id,
    //     date: { $gt: new Date() } // Only look for bookings with dates greater than now
    //   });

    //   if (futureBookings.length > 0) {
    //     return res.status(403).json({ error: "Cannot delete activity with future bookings." });
    //   }
    // }

    // Mark the activity as deleted
    activity.isDeleted = true;
    await activity.save();

    res.status(200).json({ message: "Activity marked as deleted", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addActivityToItinerary = async (req, res) => {
  const { id } = req.params; // Get the itinerary ID from the URL
  const { name, description, category, price, rating } = req.body; // Get activity details from request body

  try {
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Create a new activity object
    const newActivity = {
      name,
      description,
      category,
      price,
      rating,
    };

    // Add the new activity to the itinerary's activities array
    itinerary.activities.push(newActivity);

    // Save the updated itinerary
    await itinerary.save();

    return res.status(201).json({ message: "Activity added successfully", activity: newActivity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const ActivateActivity = async (req, res) => {
  const activityId = req.params.id;

  try {
    // Find if there are any bookings with this activity
    const bookings = await Booking.find({ activity: activityId });

    // if (bookings.length === 0) {
    //   return res.status(400).json({ message: "Activity has no bookings, cannot be activated" });
    // }

    // Now find the activity based on its ID
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.status === "Active") {
      return res.status(400).json({ message: "Activity is already active" });
    }

    activity.status = "Active";
    await activity.save();

    // Find tourists who have this activity in their bookmarks
    const tourists = await Tourist.find({
      userBookmarkedActivities: activityId,
    });

    if (tourists.length > 0) {
      // Iterate over tourists to send emails and create notifications
      const notifications = [];
      for (const tourist of tourists) {
        // Send email to the tourist
        await sendActivityActiveEmail(
          tourist,
          activity.name,
          `http://localhost:3000/activity/${activityId}`
        );
        // Create a notification for the tourist
        notifications.push({
          user: tourist._id,
          message: `The activity "${activity.name}" you are interested in has been activated and is now available for booking.`,
        });
      }

      // Save all notifications to the database
      await Notification.insertMany(notifications);
    }

    res.status(200).json({ message: "Activity activated successfully", activity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error activating activity", error });
  }
};


export const DeactivateActivity = async (req, res) => {
  const activityId = req.params.id;

  try {

    // Find if there are any bookings with this activity
    const bookings = await Booking.find({ activity: activityId });

    if (bookings.length === 0) {
      return res.status(400).json({ message: "Activity with no bookings cannot be deactivated" });
    }

    // Now find the activity based on its ID
    const activity = await Activity.findById(activityId);
   

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.status === "Inactive") {
      return res.status(400).json({ message: "Activity is already inactive" });
    }

    activity.status = "Inactive";
    await activity.save();

    res.status(200).json({ message: "Activity deactivated successfully", activity });
  } catch (error) {
    console.error("Error deactivating activity:", error);
    res.status(500).json({ message: "Error deactivating activity", error: error.message || error });
  }
};



export const fetchBookingsForActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    // Validate activity ID format
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ message: "Invalid activity ID format" });
    }

    const bookings = await Booking.find({ activity: activityId })
      .populate("tourist", "name email")
      .populate("place", "name location")
      .populate("itinerary", "name description");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this activity" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
