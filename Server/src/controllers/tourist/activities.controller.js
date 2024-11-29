import Activity from "../../models/activity.js";
import Booking from "../../models/booking.js";
import Tourist from "../../models/tourist.js";
import Itinerary from "../../models/itinerary.js";
import Notification from "../../models/notification.js";
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

// Cron job runs daily at midnight
cron.schedule("11 5 * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
  tomorrow.setHours(0, 0, 0, 0); // Reset time to midnight

  const nextDay = new Date(tomorrow);
  nextDay.setHours(23, 59, 59, 999); // End of tomorrow

  try {
    // Fetch all bookings
    const bookings = await Booking.find().populate("tourist activity itinerary");

    let notificationMessage;

    for (const booking of bookings) {
      if (booking.activity) {
        const activity = await Activity.findById(booking.activity);
        if (activity && new Date(activity.date).getTime() >= tomorrow.getTime() && new Date(activity.date).getTime() <= nextDay.getTime()) {
          const tourist = await Tourist.findById(booking.tourist);
          console.log(booking);
          console.log(tourist);
          console.log("==================");

          await sendActivityReminderEmail(tourist, activity);

          // Create a suitable message for the notification
          notificationMessage = `This is a friendly reminder about your exciting journey that starts tomorrow: Activity: ${activity.name}`;
          // Save the notification in the database
          const notification = new Notification({
            user: tourist._id, // Assuming `seller` is the seller's user ID
            message: notificationMessage,
          });

          await notification.save();
        }
      }

      if (booking.itinerary) {
        const itinerary = await Itinerary.findById(booking.itinerary);
        if (itinerary && new Date(itinerary.timeline.startTime).getTime() >= tomorrow.getTime() && new Date(itinerary.timeline.startTime).getTime() <= nextDay.getTime()) {
          const tourist = await Tourist.findById(booking.tourist);
          await sendItineraryReminderEmail(tourist, itinerary);

          // Create a suitable message for the notification
          notificationMessage = `This is a friendly reminder about your exciting journey that starts tomorrow: Iitnerary: ${itinerary.name}.`;
          // Save the notification in the database
          const notification = new Notification({
            user: tourist._id, // Assuming `seller` is the seller's user ID
            message: notificationMessage,
          });
          await notification.save();
        }
      }
    }

    console.log("Reminder emails sent for tomorrow's activities and itineraries.");
  } catch (error) {
    console.error("Error processing reminder emails:", error);
  }
});
