import express from 'express';
import {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
} from '../controllers/trip/trip.controller.js';

const router = express.Router();

// Create a new trip
router.post('/trip/create', createTrip);

// Get all trips
router.get('/trip/get', getTrips);

// Get a trip by ID
router.get('/trip/get/:id', getTripById);

// Update a trip by ID
router.put('/trip/update/:id', updateTrip);

// Delete a trip by ID
router.delete('/trip/delete/:id', deleteTrip);

export default router;
