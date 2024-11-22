import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile, getAllTourGuides ,deleteTourGuideAccount} from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js';
import { getPaidItinerariesAndRevenue } from '../controllers/tourGuide/tourGuide.user.controller.js';

const router = express.Router();

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);
router.get('/tourGuide/profile/:id', getTourGuideProfile);
router.get("/tourGuide/getAll/", getAllTourGuides);
router.delete('/tourGuide/delete/:userId', deleteTourGuideAccount);
router.get('/tourGuide/:id/revenue', getPaidItinerariesAndRevenue);



export default router; 
    