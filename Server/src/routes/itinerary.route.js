import express from "express";
import {
  editItineraryAttribute,
  createItinerary,
  getAllItinerariesForTourGuide,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  addActivityToItinerary,
  ActivateItinerary,
  DeactivateItinerary,
  getAllActiveAppropriateItineraries,
  fetchBookingsForItinerary
} from "../controllers/itinerary/itinerary.controller.js";

const router = express.Router();

// Define routes for the itinerary
router.post("/itinerary/create", createItinerary); // Create a new itinerary
router.get("/itineraries/get/tourGuide/:id", getAllItinerariesForTourGuide); // Get all itineraries
router.get("/itineraries/get", getAllItineraries); // Get all itineraries
router.get("/itineraries/active/appropriate/get/:userId", getAllActiveAppropriateItineraries); // Get all itineraries
router.get("/itinerary/get/:id", getItineraryById); // Get an itinerary by ID
router.put("/itinerary/update/:id", updateItinerary); // Update an itinerary by ID
router.put("/itinerary/delete/:id", deleteItinerary); // Delete an itinerary by ID
router.post("/itinerary/:id/addActivity", addActivityToItinerary);
router.put("/itinerary/inappropriate/:id", editItineraryAttribute);
router.put("/itinerary/activate/:id", ActivateItinerary); // tourguide activates or deactivaes it
router.put("/itinerary/deactivate/:id", DeactivateItinerary); // tourguide activates or deactivaes it

router.get("/itinerary/get/bookings/:itineraryId", fetchBookingsForItinerary);


export default router;
