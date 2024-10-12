import express from "express";
import { getSortedItineraries, getFilteredItineraries } from "../controllers/tourist/itineraries.controller.js";
import { getAllActivities} from "../controllers/tourist/activities.controller.js";
import { getProfile, editProfile } from "../controllers/tourist/profile.controller.js";
import { searchPlaces, searchActivities, searchItineraries } from "../controllers/tourist/search.controller.js";
const router = express.Router();

// GET request to filter places by type and/or tags
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/profile/:id", getProfile); // Get filtered activities
router.put("/tourist/profile/:id", editProfile); // Get filtered activities

router.post("/places/search", searchPlaces); // Search places
router.post("/activities/search", searchActivities); // Search activities
router.post("/itineraries/search", searchItineraries); // Search itineraries

export default router;
