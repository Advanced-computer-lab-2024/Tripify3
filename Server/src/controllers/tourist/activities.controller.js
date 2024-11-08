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
export const getAllActivitiesAttended = async (req, res) => {
  try {
    const currentDate = new Date();
    const { userId } = req.params;
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const bookings = await Booking.find({ tourist: userId, type: "Activity" });
    console.log(bookings);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    const attendedActivities = bookings.filter((booking) => {
      return booking.activity.date < currentDate;
    });

    res.status(200).json({ activities: attendedActivities });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
