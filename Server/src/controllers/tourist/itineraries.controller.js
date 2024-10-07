import Itinerary from "../../models/itinerary.js";

// Import your models
import Itinerary from '../models/Itinerary'; // Adjust the import path as necessary
import Tag from '../models/Tag'; // Adjust the import path as necessary

export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    
    // Prepare an array to hold the itineraries with tag names
    const itinerariesWithTagNames = await Promise.all(itineraries.map(async (itinerary) => {
      // Get the activities for the itinerary
      const activitiesWithTagNames = await Promise.all(itinerary.activities.map(async (activity) => {
        // Fetch the tags based on their IDs
        const tagNames = await Promise.all(activity.tags.map(async (tagId) => {
          const tag = await Tag.findById(tagId);
          return tag ? { id: tag._id, name: tag.name } : null; // Return tag name or null if not found
        }));

        // Filter out any null values (in case a tag wasn't found)
        const validTagNames = tagNames.filter(tag => tag !== null);

        return {
          ...activity.toObject(), // Convert activity to a plain object
          tags: validTagNames // Replace tags with the name and id
        };
      }));

      return {
        ...itinerary.toObject(), // Convert itinerary to a plain object
        activities: activitiesWithTagNames // Replace activities with updated ones
      };
    }));

    res.status(200).json(itinerariesWithTagNames);
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

// Function to filter itineraries by language, tags, date, and budget
export const getFilteredItineraries = async (req, res) => {
  try {
    const { language, tags, date, budget } = req.query; // Get language, tags, date, and budget from query parameters
    console.log(req.query);
    
    // Create the filter object
    const filter = {};

    // Include language in the filter only if provided
    if (language) {
      filter.language = language;
    }

    // If tags are provided, parse them from JSON and include them in the filter
    if (tags) {
      let tagArray;
      try {
        // Parse the tags JSON string into an array
        tagArray = JSON.parse(tags);
      } catch (error) {
        return res.status(400).json({ message: "Invalid format for tags. Please provide a valid JSON array." });
      }

      // Ensure the parsed tags is an array of strings
      if (!Array.isArray(tagArray) || !tagArray.every((tag) => typeof tag === "string")) {
        return res.status(400).json({ message: "Tags should be an array of strings." });
      }

      filter.tags = { $in: tagArray }; // Filter by tags using $in operator
    }

    // Include date in the filter only if provided
    if (date) {
      filter.date = date;
    }

    if (budget) {
      // Convert budget to a number
      const budgetValue = Number(budget);
      if (isNaN(budgetValue)) {
        return res.status(400).json({ message: "Budget must be a valid number." });
      }
      filter.budget = { $lte: budgetValue }; // Filter by budget using $lte operator
    }

    // If no valid filter criteria (language, tags, date, budget) are provided, return a 400 error
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "No valid filter criteria provided." });
    }

    // Find itineraries that match the specified filters
    const itineraries = await Itinerary.find(filter).populate("activities locations tags"); // Populate related documents

    // Check if any itineraries were found

    console.log(itineraries);
    
    // Return the filtered itineraries
    return res.status(200).json(itineraries);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
