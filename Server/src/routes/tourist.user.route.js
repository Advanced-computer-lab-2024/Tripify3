import express from "express";
import {
  getAllHistoricalPlaces,
  getFilteredHistoricalPlaces,
} from "../controllers/tourist/historicalPlaces.controller.js";
import {
  getAllItineraries,
  getSortedItineraries,
  getFilteredItineraries,
} from "../controllers/tourist/itineraries.controller.js";
import {
  getAllActivities,
  getFilteredActivities,
  getSortedActivities,
} from "../controllers/tourist/activities.controller.js";
import {
  getProfile,
  editProfile,
} from "../controllers/tourist/profile.controller.js";
const router = express.Router();

router.get("/tourist/itinerary", getAllItineraries); // Get all itineraries
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/activity/sort", getSortedActivities); // Get sorted activities
router.get("/tourist/activity/filter", getFilteredActivities); // Get filtered activities
router.get("/tourist/profile/:username", getProfile); // Get filtered activities
router.put("/tourist/profile/:username", editProfile); // Get filtered activities
router.get("/tourist/historicalPlaces", getAllHistoricalPlaces); // Get all historical places
router.get("/tourist/historicalPlaces/filter", getFilteredHistoricalPlaces); // Get filtered historical places

export default router;
