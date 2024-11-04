import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile, getAllTourGuides ,getAllItinerariesByTourGuideId } from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);

router.get('/tourGuide/profile/:id', getTourGuideProfile);

router.get("/tourGuide/getAll/", getAllTourGuides);
router.get("/tourGuide/itineraries/:id", getAllItinerariesByTourGuideId);

export default router; 
