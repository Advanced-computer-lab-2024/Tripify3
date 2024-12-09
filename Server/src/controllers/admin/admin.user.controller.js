import cron from "node-cron";
import User from "../../models/user.js";
import Category from "../../models/category.js";
import Advertiser from "../../models/advertiser.js";
import Seller from "../../models/seller.js";
import TourGuide from "../../models/tourGuide.js";
import Tourist from "../../models/tourist.js";
import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Product from "../../models/product.js";
import PromoCode from "../../models/promoCode.js";
import Notification from "../../models/notification.js";
import { sendFlagNotificationEmail, sendContentRestoredNotificationEmail, sendPromoCodeEmail, sendBirthdayPromoCodeEmail } from "../../middlewares/sendEmail.middleware.js";

export const getAllAcceptedUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ status: "Accepted" }, { type: "Tourist" }],
    });
    // Populate details based on user type
    const userDetailsPromises = users.map(async (user) => {
      if (user.type === "Advertiser") {
        const advertiserDetails = await Advertiser.findOne({ _id: user._id });
        return { ...user.toObject(), advertiserDetails };
      }
      if (user.type === "Seller") {
        const sellerDetails = await Seller.findOne({ _id: user._id });
        return { ...user.toObject(), sellerDetails };
      }
      if (user.type === "Tour Guide") {
        const tourGuideDetails = await TourGuide.findOne({ _id: user._id });
        return { ...user.toObject(), tourGuideDetails };
      }
      if (user.type === "Tourist") {
        const touristDetails = await Tourist.findOne({ _id: user._id });
        return { ...user.toObject(), touristDetails };
      }
      return user; // Return the user as is for other types
    });

    const userDetails = await Promise.all(userDetailsPromises);

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "Pending" });

    // Populate details based on user type
    const userDetailsPromises = users.map(async (user) => {
      if (user.type === "advertiser") {
        const advertiserDetails = await Advertiser.findOne({ _id: user._id });
        return { ...user.toObject(), advertiserDetails };
      }
      if (user.type === "seller") {
        const sellerDetails = await Seller.findOne({ _id: user._id });
        return { ...user.toObject(), sellerDetails };
      }
      if (user.type === "tourGuide") {
        const tourGuideDetails = await TourGuide.findOne({ _id: user._id });
        return { ...user.toObject(), tourGuideDetails };
      }
      return user; // Return the user as is for other types
    });

    const userDetails = await Promise.all(userDetailsPromises);

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const findUser = async (req, res) => {
  const { username } = req.body;
  try {
    const users = await User.find({ username });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  const { username, password, type, email } = req.body;

  console.log(req.body);
  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // If the username is available, create a new user
    const newUser = await User.create({ username, password, type, email });
    res.status(201).json(newUser); // Ensure you're returning the correct variable
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newcategory = await Category.create({ name });
    res.status(201).json({ message: "Category created successfully", newcategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const updatedcategory = await Category.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true });
    res.status(200).json(updatedcategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const deletedcategory = await Category.findOneAndDelete({ name });
    res.status(200).json(deletedcategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Remove user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  try {
    // Fetch the user to determine their type
    const user = await User.findById(id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the corresponding model based on user type
    let deletedUser;

    switch (user.type) {
      case "Advertiser":
        deletedUser = await Advertiser.findByIdAndDelete(id);

        await Activity.updateMany({ advertiser: id }, { $set: { isDeleted: true } });
        break;
      case "Seller":
        deletedUser = await Seller.findByIdAndDelete(id);
        // Mark all products associated with this seller as deleted
        await Product.updateMany({ sellerId: id }, { $set: { isDeleted: true } });
        break;
      case "Tour Guide":
        deletedUser = await TourGuide.findByIdAndDelete(id);
        await Itinerary.updateMany({ tourGuide: id }, { $set: { isDeleted: true } });
        break;
      case "Tourist":
        deletedUser = await Tourist.findByIdAndDelete(id);
        break;
      case "Tourism Governor":
        deletedUser = await User.findByIdAndDelete(id);
        break;
      case "Admin":
        deletedUser = await User.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // If the user type is not valid or the deletion failed, return an error
    if (!deletedUser) {
      return res.status(400).json({ message: "Failed to delete user" });
    }

    // Optionally, remove the user from the User model as well
    await User.findByIdAndDelete(id);

    // Return a success message
    return res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters
  const { status } = req.body; // Get the new status from the request body

  try {
    // Fetch the user to determine their type
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the status in the corresponding model based on user type
    let updatedUser;

    switch (user.type) {
      case "Advertiser":
        updatedUser = await Advertiser.findByIdAndUpdate(
          id,
          { status }, // Update the status
          { new: true, runValidators: true } // Options: return the new document and validate
        );
        break;
      case "Seller":
        updatedUser = await Seller.findByIdAndUpdate(
          id,
          { status }, // Update the status
          { new: true, runValidators: true }
        );
        break;
      case "Tour Guide":
        updatedUser = await TourGuide.findByIdAndUpdate(
          id,
          { status }, // Update the status
          { new: true, runValidators: true }
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // If the user type is not valid, return an error
    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update status" });
    }

    // Return the updated user details
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markActivityInappropriate = async (req, res) => {
  const { id } = req.params; // Get activity ID from request parameters
  const { inappropriate } = req.body; // Get new value for inappropriate from request body

  // Validate the inappropriate value
  if (typeof inappropriate !== "boolean") {
    return res.status(400).json({ message: "Inappropriate field must be a boolean value" });
  }

  try {
    // Find the activity and populate the advertiser field
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { inappropriate }, // Set the new value for inappropriate
      { new: true, runValidators: true } // Return the updated document and run validation
    ).populate("advertiser"); // Populate the advertiser field

    // Check if the activity was found
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let notificationMessage;
    // Send notification email to the advertiser
    const advertiser = updatedActivity.advertiser;
    if (updatedActivity.inappropriate) {
      await sendFlagNotificationEmail(advertiser, updatedActivity.name, "Activity");

      notificationMessage = `Your activity "${updatedActivity.name}" has been flagged as inappropriate by the admin. It will no longer be visible to tourists. Please review the content and make necessary adjustments. If you believe this is a mistake, feel free to contact support.`;

      // Save the notification in the database
      const notification = new Notification({
        user: advertiser._id, // Assuming `seller` is the seller's user ID
        message: notificationMessage,
      });

      await notification.save();
    } else {
      await sendContentRestoredNotificationEmail(advertiser, updatedActivity.name, "Activity");

      notificationMessage = `Good news! Your activity "${updatedActivity.name}" has been reviewed and is now deemed appropriate. It is visible to tourists again. Thank you for maintaining quality content!`;

      // Save the notification in the database
      const notification = new Notification({
        user: advertiser._id, // Assuming `seller` is the seller's user ID
        message: notificationMessage,
      });

      await notification.save();
    }

    res.status(200).json(updatedActivity); // Return the updated activity
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Helper function to generate a random 6-character alphanumeric code
const generatePromoCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const getAllUsersWithJoinDate = async (req, res) => {
  try {
    // Find all users and select the join date along with other details
    const users = await User.find({}, { username: 1, joinDate: 1, type: 1 });

    // Get the total count of users
    const totalUsers = await User.countDocuments();

    // Return the response with the users and the total count
    return res.status(200).json({
      totalCount: totalUsers,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to create a promo code for a specific tourist
export const createPromoCode = async (req, res) => {
  const { touristId, discount, expiryDate } = req.body;

  // Input validation
  if (!touristId || !discount || !expiryDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the tourist exists
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Generate a unique 6-character promo code
    const code = generatePromoCode();

    // Create the promo code
    const promoCode = new PromoCode({
      tourist: touristId,
      discount,
      expiryDate,
      code,
    });

    // Save the promo code
    await promoCode.save();

    // Create a notification for the tourist
    const notificationMessage = `You've received a promo code: ${code} for ${discount}% off! Use it before ${new Date(expiryDate).toLocaleDateString()}.`;
    const notification = new Notification({
      user: touristId,
      message: notificationMessage,
    });

    // Save the notification
    await notification.save();

    await sendPromoCodeEmail(tourist, discount, expiryDate, code);

    res.status(201).json({
      message: "Promo code created successfully.",
      promoCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Controller function to get users who are not Admin
export const getNonAdminUsers = async (req, res) => {
  try {
    // Fetch all users where type is not "Admin"
    const users = await User.find(
      { type: { $ne: "Admin" } }, // MongoDB query to exclude Admins
      { username: 1, joinDate: 1, type: 1 } // Select only the fields you need
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Cron job runs daily at 1 AM
cron.schedule("50 15 * * *", async () => {
  
  
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Format month as two digits (e.g., 09 for September)
  const day = today.getDate().toString().padStart(2, "0"); // Format day as two digits (e.g., 28)

  try {
    // Find tourists whose birthdate (in YYYY-MM-DD format) matches today's month and day
    const tourists = await Tourist.find({
      birthDate: { $regex: `-${month}-${day}$` }, // Matches the last part of the date: "-MM-DD"
    });

    for (const tourist of tourists) {
      const discount = 50; // 50% discount for birthdays
      const expiryDate = new Date(); // Expiry date is the end of the current day
      expiryDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999 of today

      const code = generatePromoCode(); // Generate a unique promo code

      // Create a promo code entry
      const promoCode = new PromoCode({
        tourist: tourist._id,
        discount,
        expiryDate,
        code,
      });

      await promoCode.save();

      // Create a notification for the tourist's birthday
      const notificationMessage = `🎉 Happy Birthday ${
        tourist.name || "User"
      }! 🎂 As a gift, enjoy ${discount}% off with your promo code: ${code}. Redeem it before ${expiryDate.toLocaleString()}. Have a wonderful day!`;

      // Create the notification object
      const notification = new Notification({
        user: tourist._id,
        message: notificationMessage,
      });

      await notification.save();

      // Send promo code email
      await sendBirthdayPromoCodeEmail(tourist, discount, expiryDate, code);

      console.log(`Promo code and notification sent to tourist: ${tourist.name || tourist._id}`);
    }
  } catch (error) {
    console.error("Error processing birthday promo codes:", error);
  }
});
