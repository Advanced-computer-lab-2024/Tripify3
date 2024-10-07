import Place from "../../models/place.js";
import http_code from "../../enumerations/http_code.js";
import response_status from "../../enumerations/response_status.js";
import APIFeatures from "../../utils/APIFeatures.js";
import Tag from "../../models/tag.js";
import Location from "../../models/location.js";
import User from "../../models/user.js";

export const addPlace = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      tourismGovernor,
      tags, // Tags are expected to be passed as ObjectIds
      ...placeData
    } = req.body;

    // Check if the tourismGovernor ID exists
    const governorExists = await User.findById(tourismGovernor); // Ensure this model is defined

    if (!governorExists) {
      return res.status(http_code.BAD_REQUEST).json({
        status: response_status.NEGATIVE,
        message: "Tourism Governor ID does not exist.",
      });
    }

    // Create the place with the provided data
    const place = await Place.create({ ...placeData, tourismGovernor, tags });

    res.status(201).json({
      status: response_status.POSITIVE,
      data: {
        place,
      },
    });
  } catch (err) {
    console.error(err.message); // Log the error for debugging
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err.message, // Send a more descriptive error message
    });
  }
};

export const createTag = async (req, res) => {
  const { name } = req.body;
  try {
    // Convert name to lowercase for case-insensitive comparison
    const tag = await Tag.findOne({ name: name.toLowerCase() });

    if (tag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const newtag = await Tag.create({ name });
    res.status(201).json({ message: "Tag created successfully", newtag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPlaces = async (req, res) => {
  try {
    // Fetch all places from the location collection
    const places = await Location.find().populate({ path: "tags", select: "name" }); // Populate tag names
    ;

    // Send response with the fetched places
    res.status(200).json({
      success: true,
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

export const getPlace = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from request parameters
    console.log(id);

    const place = await Place.findById(id).populate({
      path: "tags", // Populate tag details
      select: "name", // Only fetch the tag name
    }); // Find place by ID and populate tags

    if (!place) {
      return res.status(http_code.NOT_FOUND).json({
        status: response_status.NEGATIVE,
        message: "Place not found",
      });
    }

    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        place, // Return the found place
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err.message || "An error occurred",
    });
  }
};

export const getPlacesByGovernor = async (req, res) => {
  try {
    // Find places by tourismGovernor ID and populate tags to get their names
    const places = await Place.find({ tourismGovernor: req.params.id }).populate({
      path: "tags",
      select: "name", // Specify that you only want the name field from tags
    });

    // Check if any places were found
    if (!places.length) {
      return res.status(http_code.NOT_FOUND).json({
        status: response_status.NEGATIVE,
        message: "No places found for this tourism governor.",
      });
    }

    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        places: places,
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err.message || "An error occurred while fetching places.",
    });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const data = req.body;

    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        place: updatedPlace,
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err,
    });
  }
};
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place does not exists" });
    }
    await Place.findByIdAndDelete(req.params.id);
    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      message: "Place deleted successfully",
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err,
    });
  }
};
