const Itinerary = require("../models/Itinerary");

exports.getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredHistoricalPlaces = async (req, res) => {
  try {
    const { tag } = req.query;

    // Build the query object
    let query = {};
    // test
    if (tag) {
      query.tags = tag; // Assuming tags is an array field in the HistoricalPlace model
    }

    const historicalPlaces = await HistoricalPlace.find(query);
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
