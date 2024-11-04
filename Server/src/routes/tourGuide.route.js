import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile, getAllTourGuides } from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();

// Route for updating a tour guide profile
router.put('/tour-guide/profile/:id', updateTourGuideProfile);

router.get('/tour-guide/profile/:id', getTourGuideProfile);

router.get("/tour-guide/getAll/", getAllTourGuides);

export default router; 
