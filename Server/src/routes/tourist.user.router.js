import express from "express";
// import { getAllHistoricalPlaces, getFilteredHistoricalPlaces } from "../controllers/historicalPlacesController.js";
import { getAllItineraries, getSortedItineraries, getFilteredItineraries } from "../controllers/itineraries.controller.js";
import { getAllActivities, getFilteredActivities, getSortedActivities } from "../controllers/activities.controller.js";
import { getProfile, editProfile } from "../controllers/tourist.controller.js";
const router = express.Router();

router.get("/tourist/itinerary", getAllItineraries); // Get all itineraries
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/activity/sort", getSortedActivities); // Get sorted activities
router.get("/tourist/activity/filter", getFilteredActivities); // Get filtered activities
router.get("/tourist/profile/:username", getProfile); // Get filtered activities
router.put("/tourist/profile/:username", editProfile); // Get filtered activities

export default router;
