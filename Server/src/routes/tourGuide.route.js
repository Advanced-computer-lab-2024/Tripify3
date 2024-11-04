import express from 'express';
import { getTourGuideProfile, updateTourGuideProfile , uploadTourGuidePicture} from '../controllers/tourGuide/tourGuide.user.controller.js'; 
//import { upload } from '../../middlewares/mutler.middleware.js'; // Adjust the path to where your multer config file is
const router = express.Router();

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);

router.get('/tourGuide/profile/:id', getTourGuideProfile);

//router.put('/tourGuide/uploadPicture/:id', upload.single('profilePicture'), uploadTourGuidePicture);

export default router; 
