import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Booking from "../../models/booking.js";

export const createBooking = async (req, res) => {
  const { tourist, price, type, itemId, details, number } = req.body;

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
      case "Hotel":
        item = null;
        break;
      case "Flight":
        item = null;
        break;
      default:
        return res.status(400).json({ message: "Invalid booking type" });
    }

    // Check if the item was found
    
    if (!item && item !== 'Hotel' && item !== 'Flight') {
      return res.status(404).json({ message: `${type} not found` });
    }

    // Create a new booking
    let booking = new Booking({
      tourist,
      price,
      type,
      details
    });
    if(type === "Itinerary") {
      booking.itinerary = itemId;
    }
    if(type === "Trip") {
      booking.trip = itemId;
    }
    if(type === "Activity") {
      booking.activity = itemId;
    }
    await booking.save();

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
    const { bookingId } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the cancellation is at least 48 hours before the event
    const currentTime = new Date();
    const eventTime = new Date(booking.eventDate); // Assuming booking has an eventDate field
    const hoursDifference = (eventTime - currentTime) / (1000 * 60 * 60);

    if (hoursDifference < 48) {
      return res.status(400).json({
        message: "Cancellations must be made at least 48 hours before the event",
      });
    }

    // Remove the booking from the associated itinerary if the type is itinerary
    if (booking.type === "Itinerary") {
      const itinerary = await Itinerary.findById(booking.itemId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Remove the booking ID from the itinerary's bookings array
      itinerary.bookings = itinerary.bookings.filter((id) => id.toString() !== bookingId);
      await itinerary.save();
    } else if (booking.type === "Activity") {
      const activity = await Activity.findById(booking.itemId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Remove the booking ID from the itinerary's bookings array
      activity.bookings = activity.bookings.filter((id) => id.toString() !== bookingId);
      await activity.save();
    }

    // Delete the booking from the Booking model
    await booking.deleteOne();

    return res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};
