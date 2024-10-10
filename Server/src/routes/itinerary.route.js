import express from "express";
import { createItinerary, getAllItineraries, getItineraryById, updateItinerary, deleteItinerary, addActivityToItinerary } from "../controllers/itinerary/itinerary.controller.js";

const router = express.Router();

// Define routes for the itinerary
router.post("/itinerary/create", createItinerary); // Create a new itinerary
router.get("/itinerary/get", getAllItineraries); // Get all itineraries
router.get("/itinerary/get/:id", getItineraryById); // Get an itinerary by ID
router.put("/itinerary/update/:id", updateItinerary); // Update an itinerary by ID
router.delete("/itinerary/delete/:id", deleteItinerary); // Delete an itinerary by ID
router.post("/itinerary/:id/addActivity", addActivityToItinerary);

export default router;
