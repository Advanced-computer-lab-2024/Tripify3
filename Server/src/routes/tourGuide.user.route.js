import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile } from '../controllers/tourGuide/tourGuide.user.controller.js'; 
const router = express.Router();

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);

// GET route to fetch tour guide profile
router.get('/tourGuide/profile/:id', getTourGuideProfile);

export default router; // Use ES export
