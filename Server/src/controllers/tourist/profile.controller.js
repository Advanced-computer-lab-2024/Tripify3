import Tourist from "../../models/tourist.js";
import User from "../../models/user.js";
import Seller from "../../models/seller.js";
import Advertiser from "../../models/advertiser.js";
import TourGuide from "../../models/tourGuide.js";
import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import Itinerary from "../../models/itinerary.js";
import Activity from "../../models/activity.js";
import Order from "../../models/order.js";

export const redeemPoints = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { pointsToRedeem } = req.body; // Points to redeem

    const userProfile = await Tourist.findById(id);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    if (pointsToRedeem > userProfile.loyaltyPoints) {
    
      return res.status(400).json({ message: "Not enough loyalty points" });
    }

    // Calculate cash amount
    const points = pointsToRedeem - (pointsToRedeem % 10000);
    const cashAmount = Math.floor(points / 100); // 10,000 points = 100 EGP
    userProfile.loyaltyPoints -= points;
    userProfile.walletAmount += cashAmount;

    await userProfile.save(); // Save the updated profile

    res.status(200).json({
      message: "Points redeemed successfully",
      userProfile: userProfile, // Return updated user profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const userProfile = await Tourist.findById(id);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile found successfully",
      userProfile: userProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the route parameter
    const { username, email, preferences, ...updateData } = req.body; // Destructure to separate preferences

    // First, find the user to determine their type
    const currentUser = await User.findById(id); // Assuming User is your main user model

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove gender if it's empty
    if (updateData.gender === "") {
      delete updateData.gender;
    }

    // Determine which model to update based on user type
    let updatedUserProfile;

    // Exclude username and email for all types except Admin and Tourism Governor
    if (currentUser.type !== "Admin" && currentUser.type !== "Tourism Governor") {
      delete updateData.username;
      delete updateData.email;
    } else {
      // For Admin and Tourism Governor, check if the email already exists if it is being updated
      if (email && email !== currentUser.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
    }

    // Update tourist preferences if the user type is "Tourist"
    if (currentUser.type === "Tourist" && preferences) {
      updateData.preferences = preferences;
    }

    // Determine which model to update based on user type
    switch (currentUser.type) {
      case "Tourist":
        updatedUserProfile = await Tourist.findOneAndUpdate(
          { _id: id },
          { $set: updateData }, // Update using the filtered updateData
          { new: true, runValidators: true }
        );
        break;
      case "Seller":
        updatedUserProfile = await Seller.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
        break;
      case "Advertiser":
        updatedUserProfile = await Advertiser.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
        break;
      case "Tour Guide":
        updatedUserProfile = await TourGuide.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
        break;
      case "Admin":
      case "Tourism Governor":
        updatedUserProfile = await User.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    if (!updatedUserProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      userProfile: updatedUserProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteTouristAccount = async (req, res) => {
  const { id } = req.params; // Extract the tourist ID from the request params

  try {
    // Check if the tourist exists
    const tourist = await Tourist.findById(id);
    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found.",
      });
    }
    // Fetch bookings for the tourist
    const bookings = await Booking.find({ tourist: id }).populate("itinerary");
    // Fetch orders for the tourist
    const orders = await Order.find({ tourist: id });

    // Get the current date
    const currentDate = new Date();

    // Check each booking type for active bookings
    for (const booking of bookings) {
      if (booking.type === "Itinerary" && booking.itinerary) {
        // Check if itinerary end time has passed
        const itinerary = await Itinerary.findById(booking.itinerary);
        if (itinerary && new Date(itinerary.timeline.endTime) > currentDate) {
          return res.status(403).json({
            message: "Account deletion is not allowed. You have an active itinerary with a future end date.",
          });
        }
      } else if (booking.type === "Activity" && booking.activity) {
        // Check if activity date has passed
        const activity = await Activity.findById(booking.activity);
        if (activity && new Date(activity.date) > currentDate) {
          return res.status(403).json({
            message: "Account deletion is not allowed. You have an active activity with a future date.",
          });
        }
      } else if (booking.type === "Flight") {
        // Parse flight details to extract travel date and check if it is in the future
        const flightDetails = parseFlightDetails(booking.details);
        if (flightDetails.travelDate && new Date(flightDetails.travelDate) > currentDate) {
          return res.status(403).json({
            message: "Account deletion is not allowed. You have an upcoming flight.",
          });
        }
      } else if (booking.type === "Hotel") {
        // Assuming hotel has check-out date in booking details, check if it is in the future
        const hotelDetails = parseHotelDetails(booking.details);
     
        if (hotelDetails.checkOut && hotelDetails.checkOut > currentDate) {
          return res.status(403).json({
            message: "Account deletion is not allowed. You have an upcoming hotel stay.",
          });
        }
      } else if (booking.type === "Transportation") {
        // Assuming transportation details contain pickup time, check if it is in the future
        const transportDetails = parseTransportDetails(booking.details);
        if (transportDetails.pickupTime && transportDetails.pickupTime > currentDate) {
          return res.status(403).json({
            message: "Account deletion is not allowed. You have upcoming transportation.",
          });
        }
      }
    }

    // Check if any orders have a future dropOffDate
    for (const order of orders) {
      if (new Date(order.dropOffDate) > currentDate) {
        return res.status(403).json({
          message: "Account deletion is not allowed. You have an order with a future drop-off date.",
        });
      }
    }

    // If no active bookings are found, proceed with deletion
    await Tourist.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tourist account deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting tourist account:", error);
    return res.status(500).json({ message: "Error processing the request." });
  }
};

// Helper function to parse flight details and extract travel date
function parseFlightDetails(details) {
  const travelDateMatch = details.match(/Travel Date:\s*(\d{4}-\d{2}-\d{2})/);
  return { travelDate: travelDateMatch ? new Date(travelDateMatch[1]) : null };
}

// Helper function to parse hotel details and extract check-out date
function parseHotelDetails(details) {
  const checkOutMatch = details.match(/Check-out Date:\s*(\d{4}-\d{2}-\d{2})/);
  return { checkOut: checkOutMatch ? new Date(checkOutMatch[1]) : null };
}

// Helper function to parse transportation details and extract pickup time
function parseTransportDetails(details) {
  // Match the Pickup Time in the format: "Pickup Time: 21/11/2024, 04:52:00"
  const pickupTimeMatch = details.match(/Pickup Time:\s*(\d{2}\/\d{2}\/\d{4}),\s*(\d{2}:\d{2}:\d{2})/);

  if (pickupTimeMatch) {
    // Extract the date and time
    const datePart = pickupTimeMatch[1]; // "21/11/2024"
    const timePart = pickupTimeMatch[2]; // "04:52:00"

    // Convert the date format from "DD/MM/YYYY" to "YYYY-MM-DD" and append the time
    const formattedDate = datePart.split("/").reverse().join("-") + "T" + timePart;

    // Return the pickupTime as a Date object
    return { pickupTime: new Date(formattedDate) };
  }

  return { pickupTime: null }; // Return null if pickup time not found
}
