import Itinerary from '../../models/itinerary.js';

// Create a new itinerary
export const createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    console.log(req.body);
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get all itineraries
export const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('activities').populate('locations').populate({ path: "tags", select: "location" }).populate({ path: "tags", select: "name" }); // Populate tag names

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

    // Use deleteOne or findByIdAndDelete instead of remove
    await Itinerary.deleteOne({ _id: req.params.id });
    // Or you could also use:
    // await itinerary.deleteOne(); 

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addActivityToItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { activityId } = req.body; // Expecting activityId to be sent

    // Find the itinerary by ID and push the activityId to the activities array
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        { $push: { activities: activityId } }, // Ensure activities is an array of ObjectIds
        { new: true }
    );

    if (!updatedItinerary) {
        return res.status(404).send({ message: 'Itinerary not found' });
    }

    res.status(200).send(updatedItinerary);
} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error', error: error.message });
}
};
