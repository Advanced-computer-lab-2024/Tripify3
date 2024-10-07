import Activity from "../../models/activity.js";

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

export const getFilteredActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const { minPrice, maxPrice, category, rating } = req.query; // Accepting minPrice and maxPrice
    consol.log(rating);

    // Build the query object
    let query = { date: { $gt: currentDate } };

    // Check for minPrice and maxPrice
    if (minPrice || maxPrice) {
      query.price = {}; // Initialize price as an object

      if (minPrice) {
        query.price.$gte = minPrice; // Set minimum price
      }

      if (maxPrice) {
        query.price.$lte = maxPrice; // Set maximum price
      }
    }

    if (category) {
      query.category = category; // Filter by category
    }

    if (rating) {
      query.rating = { $gte: rating }; // Filter by rating
    }

    const activities = await Activity.find(query).populate("category", "name").populate({
      path: "tags", // Populate the tags field
      select: "name", // Only retrieve the tag's name
    });
    // Response message based on the activities found
    if (activities.length === 0) {
      return res.status(200).json({ message: "No activities found matching the filters.", activities: [] });
    }

    console.log(activities);

    res.status(200).json({ message: "Activities retrieved successfully.", activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSortedActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const { date, price, rating } = req.query; 

    // Build the sort object
    let sort = {};
    if (date) {
      sort.date = date === "desc" ? -1 : (date === "ascen" ? 1 : 0); // Sort by date
    }
    if (price) {
      sort.price = price === "desc" ? -1 : (price === "ascen" ? 1 : 0); // Sort by price
    }
    if (rating) {
      sort.rating = rating === "desc" ? -1 : (rating === "ascen" ? 1 : 0);  // Sort by rating
    }

    const activities = await Activity.find({ date: { $gt: currentDate } }).sort(sort);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
