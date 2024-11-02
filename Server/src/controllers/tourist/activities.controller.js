import Activity from "../../models/activity.js";
import Place from '../../models/place.js'; // Make sure the path is correct


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

