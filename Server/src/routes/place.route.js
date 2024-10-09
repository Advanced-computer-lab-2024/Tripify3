import express from 'express';
import {filterPlacesByTags , getPlaces} from '../controllers/location/place.controller.js';
const router = express.Router();

router.get('/places/filter', filterPlacesByTags);
router.get('/places/get', getPlaces);


export default router;
