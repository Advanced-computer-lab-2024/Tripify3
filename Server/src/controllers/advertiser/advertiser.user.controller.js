import Advertiser from "../../models/advertiser.js";
import Activity from "../../models/activity.js";
import Booking from "../../models/booking.js";
import Category from "../../models/category.js";
import Tag from "../../models/tag.js";
// import Category from "../../models/category.js";


// Update an existing user profile
export const updateProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProfile = await Advertiser.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Get the user profile
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Advertiser.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    // Successful response
    res.status(200).json({ message: "Profile found successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};



export const createActivity = async (req, res) => {
  console.log(req.body);
  
  try {
    const { advertiser, category, tags } = req.body;

    // Check if the advertiser exists
    const advertiserExists = await Advertiser.exists({ _id: advertiser });
    if (!advertiserExists) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Check if the category exists
    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if all tags exist
    const tagChecks = await Promise.all(tags.map(tagId => Tag.exists({ _id: tagId })));
    const invalidTags = tagChecks.some(tag => !tag);

    if (invalidTags) {
      return res.status(404).json({ message: "One or more tags not found" });
    }

      // If all checks pass, create the new activity with adjusted status
      const newActivity = new Activity({ ...req.body, status: "Active" });
      await newActivity.save();
  
     return res.status(201).json({
        message: "Activity created successfully",
        activity: newActivity,
      });

   
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error creating activity", error: error.message });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  const { advertiserId, activityId } = req.params;

  try {
    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: activityId, advertiser: advertiserId }, // Ensure consistency with "advertiser"
      { $set: req.body },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating activity", error: error.message });
  }
};

export const getAllActivitiesByAdvertiser = async (req, res) => {
  const { advertiserId } = req.params;
  try {
    const currentDate = new Date(); // Define currentDate as the current date and time

    // Find activities and populate category and tag details
    const activities = await Activity.find({ advertiser: advertiserId, date: { $gt: currentDate },  })
      .populate({ path: "category", select: "name" })
      .populate({ path: "tags", select: "name" }); 
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error retrieving activities:", error.message); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving activities", error: error.message });
  }
};


export const getAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find(); // Fetch all advertisers from the database
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisers", error });
  }
};

export const deleteAdvertiserAccount = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const currentDate = new Date();

    // Check if the user exists in the TourGuide model
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found.' });
    }

    // Retrieve all itineraries with endTime > currentDate for this tour guide
    const activities = await Activity.find({
      advertiser: advertiserId,
      'date': { $gt: currentDate },
    });

    // Extract itinerary IDs
    const activityIds = activities.map(activity => activity._id);

    // Check for any bookings with these itinerary IDs
    const hasUpcomingBookings = await Booking.exists({
      activity: { $in: activityIds }
    });

    if (hasUpcomingBookings) {
      return res.status(403).json({
        message: 'Cannot delete account. You have upcoming bookings for your activities.',
      });
    }

      // Mark all products associated with the seller as deleted
      await Activity.updateMany(
        { advertiser: advertiserId },
        { $set: { isDeleted: true } }
      );
    // Proceed to delete the tour guide's account
    await Advertiser.findByIdAndDelete(advertiserId);

    res.status(200).json({ message: 'Account and associated activities successfully deleted.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting the account and itineraries' });
  }
};

export const getAdvertiserActivityRevenue = async (req, res) => {
  try {
    const { id: advertiserId } = req.params; // Get the advertiser ID from the request parameters

    if (!advertiserId) {
      return res.status(400).json({ message: "Advertiser ID is required." });
    }

    // Step 1: Find all activities by the advertiser
    const activities = await Activity.find({ advertiser: advertiserId }).select("_id name price date");

    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found for this advertiser." });
    }

    // Step 2: Extract activity IDs
    const activityIds = activities.map((activity) => activity._id);

    // Step 3: Find paid bookings related to these activities
    const paidBookings = await Booking.find({
      activity: { $in: activityIds },
      paymentStatus: "Paid",
    });

    // Step 4: Aggregate data for each activity
    const activityStats = activities.map((activity) => {
      const bookingsForActivity = paidBookings.filter(
        (booking) => booking.activity.toString() === activity._id.toString()
      );

      const totalRevenueForActivity = bookingsForActivity.reduce(
        (sum, booking) => sum + booking.price,
        0
      );

      // Get distinct users who booked this activity
      const distinctUsers = new Set(
        bookingsForActivity.map((booking) => booking.tourist.toString())
      );

      // Extract booking dates, months, and amounts
      const bookingDatesAndMonths = bookingsForActivity.map((booking) => ({
        date: booking.date,
        month: booking.date.getMonth() + 1, // Months are zero-indexed in JavaScript
        amount: booking.price, // Include the amount for this booking
      }));

      return {
        activityId: activity._id,
        activityName: activity.name,
        activityDate: activity.date, // Include activity date here
        bookingCount: bookingsForActivity.length,
        revenue: totalRevenueForActivity,
        distinctUsers: distinctUsers.size,
        bookingDatesAndMonths, // Now includes date, month, and amount
      };
    });

    // Step 5: Calculate total revenue across all activities
    const totalRevenue = activityStats.reduce((sum, stat) => sum + stat.revenue, 0);

    // Step 6: Calculate the total number of distinct users across all activities
    const allDistinctUsers = new Set(paidBookings.map((booking) => booking.tourist.toString()));
    const totalDistinctUsers = allDistinctUsers.size;

    res.status(200).json({
      totalRevenue,
      totalDistinctUsers, // Add total distinct users here
      numberOfPaidActivities: paidBookings.length,
      activityStats,
    });
  } catch (error) {
    console.error("Error fetching advertiser activity revenue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
