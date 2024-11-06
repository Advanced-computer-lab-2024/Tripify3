import Activity from "../../models/activity.js";
import Booking from "../../models/booking.js";
import Tourist from "../../models/tourist.js";
export const getAllActivities = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch activities with future dates and populate tag names
    const activities = await Activity.find({ date: { $gt: currentDate } })
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

export const bookActivity = async (req, res) => {
  const { activityId} = req.params;
  const { touristId, totalPrice } = req.body;

  try {
    // Find the activity by ID
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }


    // Create a new booking
    const booking = new Booking({
      tourist: touristId,
      price: totalPrice,
    });

    await booking.save();
    activity.bookings.push(booking._id);
    await activity.save();

    res.status(201).json({
      message: "Activity booked successfully",
      booking: booking,
    });
    res.status(201).json({ booking: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}