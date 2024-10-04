import express from 'express';
import {
  createItinerary,
  getItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
} from '../controllers/itinerary/itinerary.controller.js';

const router = express.Router();

// Define routes for the itinerary
router.post('/itinerary/create', createItinerary); // Create a new itinerary
router.get('/itinerary/get', getItineraries); // Get all itineraries
router.get('/itinerary/get/:id', getItineraryById); // Get an itinerary by ID
router.put('/itinerary/update/:id', updateItinerary); // Update an itinerary by ID
router.delete('/itinerary/delete/:id', deleteItinerary); // Delete an itinerary by ID

export default router;
