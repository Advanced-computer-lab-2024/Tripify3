import User from "../../models/user.js";
import Category from "../../models/category.js";
import Advertiser from "../../models/advertiser.js";
import Seller from "../../models/seller.js";
import TourGuide from "../../models/tourGuide.js";
import Tourist from "../../models/tourist.js";
import Complaint from "../../models/complaint.js";

export const getAllAcceptedUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "Accepted" });

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
  const { username, password, type } = req.body;

  console.log(req.body);
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // If the username is available, create a new user
    const newUser = await User.create({ username, password, type });
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
        break;
      case "Seller":
        deletedUser = await Seller.findByIdAndDelete(id);
        break;
      case "Tour Guide":
        deletedUser = await TourGuide.findByIdAndDelete(id);
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

  console.log(req.body);

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

export const replyToComplaint = async (req, res) => {
  const { complaintId } = req.params;
  const { reply, status } = req.body;

  if (!reply) {
    return res.status(400).json({ message: "Reply is required" });
  }

  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, { reply, status: status || "In Progress" }, { new: true });

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: "Error updating complaint reply", error });
  }
};

export const sortComplaintsByDate = async (req, res) => {
  const { order = "desc" } = req.query;

  try {
    const complaints = await Complaint.find().sort({ date: order === "asc" ? 1 : -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving complaints", error });
  }
};

export const filterComplaintsByStatus = async (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const complaints = await Complaint.find({ status });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error filtering complaints by status", error });
  }
};
