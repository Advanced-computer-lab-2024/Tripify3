import express from "express";
import { getActivities, getActivityById, updateActivity, deleteActivity , commentOnActivity,rateActivity} from "../controllers/activity/activity.controller.js";

const router = express.Router();

// Define routes for the activity
router.get("/activity/get", getActivities); // Get all activities
router.get("/activity/get:id", getActivityById); // Get an activity by ID
router.put("/activity/get:id", updateActivity); // Update an activity by ID
router.delete("/activity/delete/:id", deleteActivity); // Delete an activity by ID
router.post("/activity/comment/:id",commentOnActivity); // Comment on an activity
router.post("/activity/rate/:id",rateActivity); // Rate an activity

export default router;
