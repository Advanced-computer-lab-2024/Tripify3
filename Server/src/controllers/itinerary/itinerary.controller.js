import Itinerary from '../../models/itinerary.js';

// Create a new itinerary
export const createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all itineraries
export const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('activities').populate('locations');
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an itinerary by ID
export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('activities').populate('locations');
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an itinerary by ID
export const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an itinerary by ID
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Check if there are bookings associated with this itinerary
    if (itinerary.bookings.length > 0) {
      return res.status(400).json({ message: 'Cannot delete an itinerary with existing bookings' });
    }

    await itinerary.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
