import express from "express";
import { getAllActivities, getActivityById, updateActivity, deleteActivity, getAllActivitiesForTourist } from "../controllers/activity/activity.controller.js";

const router = express.Router();

// Define routes for the activity
router.get("/activity/get", getAllActivities); // Get all activities
router.get("/tourist/activity/get/:userId", getAllActivitiesForTourist); // Get all activities
router.get("/activity/get/:activityId", getActivityById); // Get an activity by ID
router.put("/activity/get/:id", updateActivity); // Update an activity by ID
router.delete("/activity/delete/:id", deleteActivity); // Delete an activity by ID

export default router;
