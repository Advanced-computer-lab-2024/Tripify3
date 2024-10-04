import places from "../models/places.js";
import http_code from "../enumerations/http_code.js";
import response_status from "../enumerations/response_status.js";
import APIFeatures from "../utils/APIFeatures.js";
export const addPlace = async (req, res) => {
  try {
    const place = await places.create(req.body);

    res.status(http_code.CREATED).json({
      status: response_status.POSITIVE,
      data: {
        place,
      },
    });
  } catch (err) {
    res.status(http_code.BAD_REQUEST).json({
      status: response_status.NEGATIVE,
      message: err,
    });
  }
};

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
    const place = await places.findById(req.params.id);

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
    const updatedPlace = await places.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
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
