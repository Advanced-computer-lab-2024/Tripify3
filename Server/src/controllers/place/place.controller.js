import Place from '../../models/place.js'; // Import the Location model
import mongoose from "mongoose";

// Function to filter places by tags
export const filterPlacesByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Get tags from query parameters
    console.log(req.query);

    // Create the filter object
    const filter = {};

    // If tags are provided, parse them from JSON and include them in the filter
    if (tags) {
      let tagArray;
      try {
        // Parse the tags JSON string into an array
        tagArray = JSON.parse(tags);
      } catch (error) {
        return res.status(400).json({ message: "Invalid format for tags. Please provide a valid JSON array." });
      }

      // Ensure the parsed tags is an array of ObjectIds (or strings)
      if (!Array.isArray(tagArray) || !tagArray.every((tag) => mongoose.Types.ObjectId.isValid(tag))) {
        return res.status(400).json({ message: "Tags should be an array of valid ObjectIds." });
      }

      filter.tags = { $in: tagArray }; // Filter by tags using $in operator
    }

    // If no valid filter criteria (tags) are provided, return a 400 error
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "No valid filter criteria provided." });
    }

    // Find places that match the specified filters
    const places = await Place.find(filter).populate("tags tourismGovernor"); // Populate related documents

    // Check if any places were found
    if (places.length === 0) {
      return res.status(404).json({ message: "No places found matching the provided tags." });
    }

    // Return the filtered places
    return res.status(200).json({ success: true, data: places });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getPlaces = async (req, res) => {
  try{
    // Fetch all places from the location collection
    const places = await Place.find().populate({ path: "tags", select: "name" }); // Populate tag names
    

    // Send response with the fetched places
    res.status(200).json({
      message: "Places found Successfully",
      data: places,
    });
  } catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({
      success: false,
      message: "Server error, could not retrieve places.",
    });
  }
};
