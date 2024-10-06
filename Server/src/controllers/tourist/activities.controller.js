import Activity from "../../models/activity.js";

export const getAllActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const activities = await Activity.find({ date: { $gt: currentDate } });
    res.status(200).json({ activities: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const { budget, category, rating } = req.query;
    // Build the query object
    let query = { date: { $gt: currentDate } };

    if (budget) {
      query.price = { $lte: budget }; // Assuming budget is a maximum value
    }

    if (category) {
      query.category = category;
    }
    if (rating) {
      query.rating = { $gte: rating }; // Assuming rating is a min value
    }

    const activities = await Activity.find(query).populate("categoryId","name");
    res.status(200).json({ activities: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSortedActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const { sortBy, sortOrder } = req.query;

    // Build the sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const activities = await Activity.find({ date: { $gt: currentDate } }).sort(sort);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
