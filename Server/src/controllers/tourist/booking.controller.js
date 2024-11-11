import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Booking from "../../models/booking.js";
import User from "../../models/user.js";
import Place from "../../models/place.js";
import Tourist from "../../models/tourist.js";
import Review from "../../models/review.js"; // Adju

export const getReview = async (req, res) => {
  const { booking, itemId, type, tourist } = req.params;
  console.log(req.params);

  try {
    // Validate input parameters
    if (!booking || !itemId || !type || !tourist) {
      return res.status(400).json({ message: "Booking, itemId, type, and tourist are required." });
    }

    // Check if type is valid
    if (!["activity", "itinerary"].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Type must be either 'activity' or 'itinerary'." });
    }

    // Define the search criteria based on type
    let itemCriteria = { _id: itemId };
    let model;
    let review;

    if (type.toLowerCase() === "activity") {
      model = Activity;

      review = await Review.findOne({ tourist, booking, [type]: itemId });
      if (review) {
        return res.status(200).json({ message: "Review found successfully", review: review });
      } else {
        return res.status(200).json({ message: "No review found.", review: {} });
      }
    } else if (type.toLowerCase() === "itinerary") {
      model = Itinerary;
      const itinerary = await Itinerary.findById(itemId);

      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found." });
      }
      const tourGuideId = itinerary.tourGuide;
      console.log("----------------------------");
      console.log(tourGuideId);

      // Then, search for a review from this tourist for this tour guide on the given booking
      const tourGuideReview = await Review.findOne({ tourist, booking, tourGuide: tourGuideId });
      console.log("-------------------------");
      console.log(tourGuideReview);

      review = await Review.findOne({ tourist, booking, [type]: itemId });
      if (review) {
        return res.status(200).json({ message: "Review found successfully", tourGuideReview, review });
      } else {
        return res.status(200).json({ message: "No review found.", review: {} });
      }
    }
    // Search for an existing review by tourist and booking

    // Return review if found, otherwise empty response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { tourist, price, type, itemId, details, tickets } = req.body;

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
     
    if (user.walletAmount < price) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    let loyaltyPoints = 0;
    if (user.loyaltyPoints <= 100000) {
      // Level 1
      loyaltyPoints = price * 0.5;
    } else if (user.loyaltyPoints <= 500000) {
      // Level 2
      loyaltyPoints = price * 1;
    } else {
      // Level 3
      loyaltyPoints = price * 1.5;
    }

    // Add loyalty points to tourist's account
    user.loyaltyPoints = (user.loyaltyPoints || 0) + loyaltyPoints;
    // Deduct total price from tourist's wallet
    user.walletAmount -= price;
    await user.save(); // Save the updated tourist document

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

    console.log(booking);

    // Add the booking ID to the bookings array in the associated model

    return res.status(201).json({
      message: `${type} booked successfully`,
      booking: booking,
    });
  } catch (error) {
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
    console.log(hoursDifference);
    console.log(new Date(eventDate));
    console.log(currentTime);

    if (hoursDifference < 48) {
      return res.status(400).json({
        message: "Cancellations must be made at least 48 hours before the event",
      });
    }

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
