import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile, getAllTourGuides ,checkUpcomingItineraries ,deleteTourGuideAccount} from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();
import { getCommentById } from '../controllers/tourGuide/tourGuide.user.controller.js'; // Adjust the path as necessary

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);

router.get('/tourGuide/profile/:id', getTourGuideProfile);
router.get('/comment/:id', getCommentById);
router.get("/tourGuide/getAll/", getAllTourGuides);

router.get('/itineraries/check-upcoming/:userId', checkUpcomingItineraries); 

router.delete('/tourGuide/delete/:userId', deleteTourGuideAccount);



export default router; 
    