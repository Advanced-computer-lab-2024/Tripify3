import express from 'express';
import {filterPlacesByTags , getPlaces,getPlaceById} from '../controllers/place/place.controller.js';
const router = express.Router();

router.get('/places/filter', filterPlacesByTags);
router.get('/places/get', getPlaces);
router.get('/place/get/:id',getPlaceById)

export default router;
