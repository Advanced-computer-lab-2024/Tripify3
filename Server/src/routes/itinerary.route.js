import express from "express";
import { createComment,editItineraryAttribute, createItinerary, getAllItineraries, getItineraryById, updateItinerary, deleteItinerary, addActivityToItinerary } from "../controllers/itinerary/itinerary.controller.js";

const router = express.Router();

// Define routes for the itinerary
router.post("/itinerary/create", createItinerary); // Create a new itinerary
router.get("/itineraries/get/:id", getAllItineraries); // Get all itineraries
router.get("/itinerary/get/:id", getItineraryById); // Get an itinerary by ID
router.put("/itinerary/update/:id", updateItinerary); // Update an itinerary by ID
router.delete("/itinerary/delete/:id", deleteItinerary); // Delete an itinerary by ID
router.post("/itinerary/:id/addActivity", addActivityToItinerary);
// Route to edit itinerary attribute
router.put('/itineraries/:id/edit', editItineraryAttribute);
router.post("/itinerary/comment/:activityId", createComment); // Comment on an itinerary


export default router;
