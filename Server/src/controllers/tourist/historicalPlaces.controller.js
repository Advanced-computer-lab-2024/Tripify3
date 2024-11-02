import Location from "../../models/location.js";

export const getAllHistoricalPlaces = async (req, res) => {
  try {
    const historicalPlaces = await Location.find();
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

