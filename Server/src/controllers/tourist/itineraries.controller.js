import Itinerary from "../../models/itinerary.js";
import mongoose from "mongoose";


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
    const { language, tags, budget } = req.query; // Get language, tags, and budget from query parameters

    // Create the filter object
    const filter = {};

    // If language is provided, filter by it (case-insensitive)
    if (language) {
      filter.language = { $regex: new RegExp(language, 'i') }; // Case-insensitive search for language
    }

    // If tags are provided and it's an array, filter itineraries that have activities containing these tags
    if (tags && Array.isArray(tags)) {
      const tagObjectIds = tags.map(tag => {
        if (!mongoose.Types.ObjectId.isValid(tag)) {
          return res.status(400).json({ message: `Invalid tag ID: ${tag}` });
        }
        return new mongoose.Types.ObjectId(tag); // Convert each tag to ObjectId
      });

      // Add the tag filter on activities' tags
      filter['activities.tags'] = { $in: tagObjectIds };
    }

    // If budget is provided, filter itineraries with budget less than or equal to the input
    if (budget) {
      const budgetValue = Number(budget); // Convert budget to a number
      if (isNaN(budgetValue)) {
        return res.status(400).json({ message: 'Invalid budget value' });
      }
      filter.budget = { $lte: budgetValue }; // Add budget filter
    }

    // Find itineraries and populate activities and tags
    let itineraries = await Itinerary.find(filter)
      .populate({
        path: 'activities',
        populate: { path: 'tags', select: '_id name' }, // Populate tags inside activities
      })
      .populate('locations tags'); // Optionally populate other fields like locations and itinerary-level tags

    console.log(itineraries);

    return res.status(200).json(itineraries);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
