import express from 'express';
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from '../controllers/location/location.controller.js';

const router = express.Router();

router.post('/location/create', createLocation);
router.get('/location/get', getLocations);
router.get('/location/get/:id', getLocationById);
router.put('/location/update/:id', updateLocation);
router.delete('location/delete/:id', deleteLocation);

export default router;
