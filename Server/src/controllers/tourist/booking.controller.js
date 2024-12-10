import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Booking from "../../models/booking.js";
import User from "../../models/user.js";
import Place from "../../models/place.js";
import Tourist from "../../models/tourist.js";
import Payment from "../../models/payment.js";
import Notification from "../../models/notification.js";
import cron from "node-cron";
import { sendItineraryReminderEmail, sendActivityReminderEmail } from "../../middlewares/sendEmail.middleware.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  const { tourist, price, type, itemId, details } = req.body;
  let { tickets } = req.body;
  console.log(req.body);
  

  try {
    let item;
    // Use a switch statement to find the correct model based on the type
    switch (type) {
      case "Activity":
        item = await Activity.findById(itemId);
        break;
      case "Itinerary":
        item = await Itinerary.findById(itemId);
        break;
      case "Place":
        item = await Place.findById(itemId);
        break;
      case "Hotel":
        item = null;
        break;
      case "Flight":
        item = null;
        break;
      case "Transportation":
        item = null;
        break;
      default:
        return res.status(400).json({ message: "Invalid booking type" });
    }

    // Check if the item was found

    if (!item && type != "Hotel" && type != "Flight" && type != "Transportation") {
      return res.status(404).json({ message: `${type} not found` });
    }

    // Find the tourist by ID and check if they exist
    const user = await Tourist.findById(tourist);
    if (!user) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (tickets === null || tickets === "null") {
      tickets = 0;
    }
    // Create a new booking
    let booking = new Booking({
      tourist,
      price,
      tickets,
      type,
      details,
    });

    if (type === "Itinerary") {
      booking.itinerary = itemId;
    }
    if (type === "Trip") {
      booking.trip = itemId;
    }
    if (type === "Activity") {
      booking.activity = itemId;
    }
    if (type === "Place") {
      booking.place = itemId;
    }
    await booking.save();

    // Add the booking ID to the bookings array in the associated model

    return res.status(201).json({
      message: `${type} booked successfully`,
      booking: booking,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Determine the event date based on the booking type
    let eventDate;
    if (booking.type === "Itinerary") {
      const itinerary = await Itinerary.findById(booking.itinerary);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      eventDate = itinerary.timeline.startTime;
    } else if (booking.type === "Activity") {
      const activity = await Activity.findById(booking.activity);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      eventDate = activity.date;
    } else {
      return res.status(400).json({ message: "Unsupported booking type" });
    }

    // Check if the cancellation is at least 48 hours before the event
    const currentTime = new Date();
    const hoursDifference = (new Date(eventDate) - currentTime) / (1000 * 60 * 60);

    if (hoursDifference < 48) {
      return res.status(400).json({
        message: "Cancellations must be made at least 48 hours before the event",
      });
    }

    // Find the related payment in the Payment table
    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found for this booking" });
    }

    // Update the tourist's wallet
    const tourist = await Tourist.findById(payment.tourist);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    tourist.walletAmount += payment.amount; // Add the payment amount to the wallet
    await tourist.save();

    // Delete the payment record
    await payment.deleteOne();

    // Delete the booking from the Booking model
    await booking.deleteOne();

    return res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Get the current date
    const now = new Date();

    // Find bookings related to activities and itineraries
    const bookings = await Booking.find({ tourist: touristId })
      .populate("activity")
      .populate({
        path: "itinerary",
        populate: {
          path: "timeline",
        },
      });

    // Separate upcoming and past bookings
    const upcomingBookings = [];
    const pastBookings = [];

    bookings.forEach((booking) => {
      if (booking.type === "Activity" && booking.activity) {
        if (new Date(booking.activity.date) > now) {
          upcomingBookings.push(booking);
        } else {
          pastBookings.push(booking);
        }
      } else if (booking.type === "Itinerary" && booking.itinerary) {
        if (new Date(booking.itinerary.timeline.endTime) > now) {
          upcomingBookings.push(booking);
        } else {
          pastBookings.push(booking);
        }
      }
    });

    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: { upcoming: upcomingBookings, past: pastBookings },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTourGuideProfile = async (req, res) => {
  const { tourGuideId, touristId } = req.params;

  try {
    // Fetch the tour guide by ID
    const tourGuide = await User.findById(tourGuideId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    // Fetch the tourist by ID to check following status
    const tourist = await User.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the tour guide is in the tourist's following list
    const isFollowing = tourist.following.includes(tourGuideId);

    // Respond with the tour guide's details and following status
    res.status(200).json({
      tourGuide,
      isFollowing,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cron job runs daily at midnight
cron.schedule("23 04 * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
  tomorrow.setHours(0, 0, 0, 0); // Reset time to midnight

  const nextDay = new Date(tomorrow);
  nextDay.setHours(23, 59, 59, 999); // End of tomorrow

  try {
    // Fetch all bookings
    const bookings = await Booking.find().populate("tourist activity itinerary");

    // Array to track sent notifications and emails
    const sentNotifications = [];

    let notificationMessage;

    for (const booking of bookings) {
      if (booking.activity) {
        const activity = await Activity.findById(booking.activity);

        if (
          activity &&
          new Date(activity.date).getTime() >= tomorrow.getTime() &&
          new Date(activity.date).getTime() <= nextDay.getTime()
        ) {
          const tourist = await Tourist.findById(booking.tourist);

          // Check if the tourist has already been notified for this activity
          if (!sentNotifications.some((item) => item.touristId === tourist._id.toString() && item.eventId === activity._id.toString())) {
            // Send email reminder
            await sendActivityReminderEmail(tourist, activity);

            // Create a notification message
            notificationMessage = `This is a friendly reminder about your exciting journey that starts tomorrow: Activity: ${activity.name}`;

            // Save the notification in the database
            const notification = new Notification({
              user: tourist._id,
              message: notificationMessage,
            });
            await notification.save();

            // Add to the sent notifications array
            sentNotifications.push({ touristId: tourist._id.toString(), eventId: activity._id.toString() });
          }
        }
      }

      if (booking.itinerary) {
        const itinerary = await Itinerary.findById(booking.itinerary);

        if (
          itinerary &&
          new Date(itinerary.timeline.startTime).getTime() >= tomorrow.getTime() &&
          new Date(itinerary.timeline.startTime).getTime() <= nextDay.getTime()
        ) {
          const tourist = await Tourist.findById(booking.tourist);

          // Check if the tourist has already been notified for this itinerary
          if (!sentNotifications.some((item) => item.touristId === tourist._id.toString() && item.eventId === itinerary._id.toString())) {
            // Send email reminder
            await sendItineraryReminderEmail(tourist, itinerary);

            // Create a notification message
            notificationMessage = `This is a friendly reminder about your exciting journey that starts tomorrow: Itinerary: ${itinerary.name}`;

            // Save the notification in the database
            const notification = new Notification({
              user: tourist._id,
              message: notificationMessage,
            });
            await notification.save();

            // Add to the sent notifications array
            sentNotifications.push({ touristId: tourist._id.toString(), eventId: itinerary._id.toString() });
          }
        }
      }
    }

    console.log("Reminder emails sent for tomorrow's activities and itineraries.");
  } catch (error) {
    console.error("Error processing reminder emails:", error);
  }
});




export const getTouristBookmarks = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

      // Calculate tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Set to the start of the day
  

     // Find the tourist by user ID
     const tourist = await Tourist.findById(userId)
     .populate({
       path: "userBookmarkedItineraries",
       match: {
         isDeleted: false,
         inappropriate: false,
         status: "Active",
         "timeline.startTime": { $gte: tomorrow },
       },
       select: "name price rating status", // Select specific fields
     })
     .populate({
       path: "userBookmarkedActivities",
       match: {
         isDeleted: false,
         inappropriate: false,
         status: "Active",
         date: { $gte: tomorrow }, // Check date is from tomorrow onwards
       },
       select: "name location time date price status", // Select specific fields
     });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Extract bookmarked itineraries and activities
    const bookmarkedItineraries = tourist.userBookmarkedItineraries || [];
    const bookmarkedActivities = tourist.userBookmarkedActivities || [];

    res.status(200).json({
      bookmarkedItineraries,
      bookmarkedActivities,
    });
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
