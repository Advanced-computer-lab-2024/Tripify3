import places from "../models/places.js";
import http_code from "../enumerations/http_code.js";
import response_status from "../enumerations/response_status.js";
import APIFeatures from "../utils/APIFeatures.js";
import Tag from "../models/tag.js"
export const addPlace = async (req, res) => {
  try {
    // Extract tags from the request body
    const { tags, ...placeData } = req.body;

    // Process tags: check if they exist or create new ones
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag._id; // Return the ObjectId of the tag
      })
    );

    // Create the place with associated tags
    const place = await places.create({ ...placeData, tags: tagIds });

    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        place,
      },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err.message, // Send a more descriptive error message
    });
  }
};
export const createTag = async (req,res) => {
  let tagName = req.body.name;
  try {
    let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
          res.status(http_code.OK).json({
            status: response_status.POSITIVE,
            data: {
              tag,
            },
          });
        }
        else{
          res.status(http_code.BAD_REQUEST).json({
            status: response_status.NEGATIVE,
            message: "Tag already exists",
          });
        }
  }
  catch(err){
    console.error(err);
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err.message,
    });
  } 
}

export const getAllPlaces = async (req, res) => {
  try {
    const features = new APIFeatures(places.find(), req.query).filter();

    const allPlaces = await features.query;

    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        places: allPlaces,
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err,
    });
  }
};

export const getPlace = async (req, res) => {
  try {
    const place = await places.findById(req.params.id).populate("tags");

    res.status(http_code.OK).json({
      status: response_status.POSITIVE,
      data: {
        place: place,
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err,
    });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const data = req.body;

    const updatedPlace = await places.findByIdAndUpdate(
      req.params.id,
     data,
      {
        new: true,
       
      }
    );
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
    await places.findByIdAndDelete(req.params.id);
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
