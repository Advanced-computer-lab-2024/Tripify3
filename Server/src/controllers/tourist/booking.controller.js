import Booking from "../../models/Booking.js"; // Assuming you have a Booking model

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
      return res
        .status(400)
        .json({
          message:
            "Cancellations must be made at least 48 hours before the event",
        });
    }

    // Update the booking status to "canceled"
    booking.status = "canceled";
    await booking.save();

    return res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

