import express from "express";
import { createBooking, cancelBooking, getAllBookings, getTourGuideProfile } from "../controllers/tourist/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/booking/create", createBooking);

// Get all bookings
router.get("/bookings/get/:touristId", getAllBookings);
router.get("/booking/get/tour-guide/profile/:tourGuideId/:touristId", getTourGuideProfile);

// Delete a booking by ID
router.delete("/boooking/delete/:id", cancelBooking);

export default router;
