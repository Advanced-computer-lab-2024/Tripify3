import Trip from '../../models/Trip.js';

// Create a new trip
export const createTrip = async (req, res) => {
    try {
        const trip = new Trip(req.body);
        await trip.save();
        res.status(201).json({ message: "Trip created successfully", trip });
    } catch (error) {
        res.status(400).json({ message: "Failed to create trip", error });
    }
};

// Get all trips
export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('tourGuide').populate('tourists');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: "Failed to get trips", error });
    }
};

// Get a trip by ID
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('tourGuide').populate('tourists');
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: "Failed to get trip", error });
    }
};

// Update a trip by ID
export const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json({ message: "Trip updated successfully", trip });
    } catch (error) {
        res.status(400).json({ message: "Failed to update trip", error });
    }
};

// Delete a trip by ID
export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete trip", error });
    }
};
