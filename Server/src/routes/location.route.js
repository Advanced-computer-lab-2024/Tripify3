import express from 'express';
// import {
//   createLocation,
//   getLocations,
//   getLocationById,
//   updateLocation,
//   deleteLocation,
// } from '../controllers/location/location.controller.js';

import {filterPlacesByTags , getPlaces} from '../controllers/location/place.controller.js';
const router = express.Router();

// router.post('/location/create', createLocation);
// Route to filter locations by tags
router.get('/places/filter', filterPlacesByTags);
router.get('/places/get', getPlaces);
// router.get('/location/get', getLocations);
// router.get('/location/get/:id', getLocationById);
// router.put('/location/update/:id', updateLocation);
// router.delete('location/delete/:id', deleteLocation);
// router.delete('location/filter/', Location);

export default router;
