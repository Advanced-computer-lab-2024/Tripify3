import Place from "../../models/place.js"; // Import the Location model
import Review from "../../models/review.js"; // Import the Location model
import mongoose from "mongoose";

export const getAllPlaces = async (req, res) => {
  try {
    // Fetch all places from the location collection
    const places = await Place.find().populate({ path: "tags", select: "name" }); // Populate tag names
    // Send response with the fetched places
    res.status(200).json({
      message: "Places found Successfully",
      places: places,
    });
  } catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({
      success: false,
      message: "Server error, could not retrieve places.",
    });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL parameters

    // Find place by ID and populate tags with only the 'name' field
    const place = await Place.findById(id)
      .populate({
        path: "tags",
        select: "name", // Populate 'tags' field to include only the 'name' field
      });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Retrieve reviews and populate the 'tourist' field with the 'username' field
    const reviews = await Review.find({ place: req.params.id })
      .populate("tourist", "username") // Populate tourist with 'username' field only
      .select("rating comment tourist"); // Select only the fields needed for reviews

    return res.status(200).json({
      message: "Place found successfully",
      data: { place, reviews },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
