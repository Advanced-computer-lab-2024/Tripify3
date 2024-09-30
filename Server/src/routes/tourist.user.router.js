import express from "express";
//import { resetPassword, sendVerificationCode, verifyVerificationCode } from "../controllers/users.auth.controller.js";
import {
  getAllHistoricalPlaces,
  getFilteredHistoricalPlaces,
} from "../controllers/historicalPlacesController.js";
import {
  getAllItineraries,
  getSortedItineraries,
  getFilteredItineraries,
} from "../controllers/itineraryController.js";
import {
  getAllActivities,
  getFilteredActivities,
  getSortedActivities,
} from "../controllers/activitiesController.js";
const router = express.Router();

// Authentication Routes
router.get("/tourist/search/activity", getAllHistoricalPlaces); // Get all Historical Places
router.get("/tourist/filter/activity", getFilteredHistoricalPlaces); // Get filtered historical places
router.get("/tourist/itinerary", getAllItineraries); // Get all itineraries
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/activity/sort", getSortedActivities); // Get sorted activities
router.get("/tourist/activity/filter", getFilteredActivities); // Get filtered activities

// router.post("/tourist/search/activity", resetPassword); // Reset password after verification
// router.post("/tourist/filter/activity", sendVerificationCode); // Send verification code
// router.post("/", verifyVerificationCode); // Send verification code

export default router;
