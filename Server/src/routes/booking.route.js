import express from "express";
import { createBooking, cancelBooking, getAllBookings, getTourGuideProfile } from "../controllers/tourist/booking.controller.js";
import { getReview } from "../controllers/tourist/review.controller.js";

const router = express.Router();

// Create a new booking
router.post("/booking/create", createBooking);
// Get all bookings
router.get("/bookings/get/:touristId", getAllBookings);
router.get("/booking/get/tour-guide/profile/:tourGuideId/:touristId", getTourGuideProfile);

// Delete a booking by ID
router.delete("/booking/delete/:bookingId", cancelBooking);
router.get("/booking/get/reviews/:booking/:tourist/:type/:itemId", getReview);

export default router;
