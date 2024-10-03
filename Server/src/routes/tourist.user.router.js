import express from "express";
// import { getAllHistoricalPlaces, getFilteredHistoricalPlaces } from "../controllers/historicalPlacesController.js";
import { getAllItineraries, getSortedItineraries, getFilteredItineraries } from "../controllers/itineraries.controller.js";
import { getAllActivities, getFilteredActivities, getSortedActivities } from "../controllers/activities.controller.js";
const router = express.Router();

// Authentication Routes
// router.get("/tourist/search/activity", getAllHistoricalPlaces); // Get all Historical Places
// router.get("/tourist/filter/activity", getFilteredHistoricalPlaces); // Get filtered historical places
router.get("/tourist/itinerary", getAllItineraries); // Get all itineraries
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/activity/sort", getSortedActivities); // Get sorted activities
router.get("/tourist/activity/filter", getFilteredActivities); // Get filtered activities
router.get("/tourist/get/profile/:username", getFilteredActivities); // Get filtered activities
router.post("/tourist/edit/profile", getFilteredActivities); // Get filtered activities

export default router;
