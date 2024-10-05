import User from "../../models/user.js";
import Tourist from "../../models/tourist.js";
import Category from "../../models/category.js";
import Admin from "../../models/admin.js";
import Seller from "../../models/seller.js";
import Advertiser from "../../models/advertiser.js";
import TourGuide from "../../models/tourGuide.js"; // Adjust the path as necessary
import Tag from "../../models/tag.js"; // Adjust the path as necessary
// import tourismgovernor from "../models/TourismGoverner.js"; // Adjust the path as necessary

export const findUser = async (req, res) => {
  const { username } = req.body;
  try {
    const users = await User.find({ username });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// // Requirment 16 i think we can searchh for the user using his type in each table and that we can take it from the front end through the body
export const deleteUser = async (req, res) => {
  const { username } = req.body;
  try {

    const deletedUser = await User.findOneAndDelete({ username });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// // Requirment 17
export const addTourismGovernor = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newtourismgovernor = await User.create({ username, password, type: "Tourism Governor" });
    res.status(201).json(newtourismgovernor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // requirement 18
export const addAdmin = async (req, res) => {
  const { username,name, password } = req.body;
  try {
    const newadmin = await User.create({ username,name, password, type: "Admin" });
    res.status(201).json(newadmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // requirement 19
export const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newcategory = await Category.create({ name });
    res.status(201).json(newcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewCategory = async (req, res) => {
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
export const addTag = async (req, res) => {
  const { name } = req.body;
  try {
    const newtag = await Tag.create({ name });
    res.status(201).json(newtag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewTag = async (req, res) => {
  try {
    const tag = await Tag.find();
    res.status(200).json(tag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const updateTag = async (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const updatedtag = await Tag.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true });
    res.status(200).json(updatedtag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  const { name } = req.body;
  try {
    const deletedtag = await Tag.findOneAndDelete({ name });
    res.status(200).json(deletedtag);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
