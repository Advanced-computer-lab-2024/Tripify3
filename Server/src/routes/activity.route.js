import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from '../controllers/activity/activity.controller.js';

const router = express.Router();

// Define routes for the activity
router.post('/activity/create', createActivity); // Create a new activity
router.get('/activity/get', getActivities); // Get all activities
router.get('/activity/get:id', getActivityById); // Get an activity by ID
router.put('/activity/get:id', updateActivity); // Update an activity by ID
router.delete('/activity/delete/:id', deleteActivity); // Delete an activity by ID

export default router;
