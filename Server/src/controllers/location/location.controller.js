import Location from '../../models/location.js'; // Import the Location model



// Create a new location   tested
export const createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json({ message: 'Location created successfully', location });
  } catch (error) {
    res.status(400).json({ message: 'Error creating location', error });
  }
};

// Get all locations untested
export const getLocations = async (req, res) => {
  try{
    // Fetch all places from the location collection
    const places = await Location.find().populate({ path: "tags", select: "name" }); // Populate tag names
    

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

// Get a single location by ID untested
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location', error });
  }
};

// Update a location by ID untested
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location updated successfully', location });
  } catch (error) {
    res.status(400).json({ message: 'Error updating location', error });
  }
};

// Delete a location by ID untested
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error });
  }
};
