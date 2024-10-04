import Itinerary from "../../models/itinerary.js";

export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSortedItineraries = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;

    // Build the sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const itineraries = await Itinerary.find().sort(sort);
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredItineraries = async (req, res) => {
  try {
    const currentDate = new Date();
    const { budget, date, preferences, language } = req.query;

    // Build the query object
    let query = { date: { $gte: currentDate } };

    if (budget) {
      query.budget = { $lte: budget }; // Assuming budget is a maximum value
    }

    if (date) {
      query.date = { $gte: new Date(date) }; // Assuming date is a minimum value
    }

    if (preferences) {
      query.preferences = { $in: preferences.split(",") }; // Assuming preferences is a comma-separated list
    }

    if (language) {
      query.language = language;
    }

    const itineraries = await Itinerary.find(query);
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
