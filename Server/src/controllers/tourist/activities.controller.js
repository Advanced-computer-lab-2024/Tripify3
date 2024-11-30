import Booking from "../../models/booking.js";
import Tourist from "../../models/tourist.js";
import cron from "node-cron";
import { sendItineraryReminderEmail, sendActivityReminderEmail } from "../../middlewares/sendEmail.middleware.js";

export const getAllActivitiesAttended = async (req, res) => {
  try {
    const currentDate = new Date();
    const { userId } = req.params;
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const bookings = await Booking.find({ tourist: userId, type: "Activity" });

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

