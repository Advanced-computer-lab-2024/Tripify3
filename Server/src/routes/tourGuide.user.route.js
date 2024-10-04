import express from 'express';
import { createTourGuide, updateTourGuideProfile } from '../controllers/tourGuide.user.controller.js'; // Use ES import
const router = express.Router();

// Route for updating a tour guide profile
router.put('/update/:id', updateTourGuideProfile);

// Route for creating a new tour guide
router.post('/createTourGuide', createTourGuide);

export default router; // Use ES export
