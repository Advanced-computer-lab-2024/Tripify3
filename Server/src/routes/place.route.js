import express from 'express';
import { getAllPlaces,getPlaceById} from '../controllers/place/place.controller.js';
const router = express.Router();

router.get('/places/get', getAllPlaces);
router.get('/place/get/:id',getPlaceById)

export default router;
