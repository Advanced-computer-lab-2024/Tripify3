// import HistoricalPlace from "../models/historicalPlace.js";

// export const getAllHistoricalPlaces = async (req, res) => {
//   try {
//     const historicalPlaces = await historicalPlace.find();
//     res.json(historicalPlaces);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Location = require("../models/location");

exports.getAllHistoricalPlaces = async (req, res) => {
  try {
    const historicalPlaces = await Location.find();
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getFilteredHistoricalPlaces = async (req, res) => {
//   try {
//     const { tag } = req.query;

//     // Build the query object
//     let query = {};
//     // test
//     if (tag) {
//       query.tags = tag; // Assuming tags is an array field in the HistoricalPlace model
//     }

//     const historicalPlaces = await historicalPlace.find(query);
//     res.json(historicalPlaces);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getFilteredHistoricalPlaces = async (req, res) => {
  try {
    const { tag } = req.query;

    // Build the query object
    let query = {};

    if (tag) {
      query.tags = tag; // Assuming tags is an array field in the Location model
    }

    const historicalPlaces = await Location.find(query).populate('tags');
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
