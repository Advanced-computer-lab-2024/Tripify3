import express from 'express';
import {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} from '../controllers/booking/booking.controller.js';

const router = express.Router();

// Create a new booking
router.post('/booking/create', createBooking);

// Get all bookings
router.get('/booking/get', getBookings);

// Update a booking by ID
router.put('/booking/update/:id', updateBooking);

// Delete a booking by ID
router.delete('/boooking/delete/:id', deleteBooking);

export default router;
