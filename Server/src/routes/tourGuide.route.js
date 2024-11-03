import express from 'express';
<<<<<<< HEAD
import { getTourGuideProfile, updateTourGuideProfile , uploadTourGuidePicture , getAllTourGuides } from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js';
=======
import { getTourGuideProfile, updateTourGuideProfile , uploadTourGuidePicture} from '../controllers/tourGuide/tourGuide.user.controller.js'; 
import { upload } from '../middlewares/multer.middleware.js'; // Adjust the path to where your multer config file is
>>>>>>> 3aed2ef1f255d4dba86dea30fbc474ad9195da43
const router = express.Router();

// Route for updating a tour guide profile
router.put('/tourGuide/profile/:id', updateTourGuideProfile);

router.get('/tourGuide/profile/:id', getTourGuideProfile);

router.put('/tourGuide/uploadPicture/:id', upload.single('profilePicture'), uploadTourGuidePicture);


router.get("/tour-guide/getAll/", getAllTourGuides);

export default router; 
