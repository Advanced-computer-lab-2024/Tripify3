import express from "express";
import { createOrder, createBooking, cancelBooking, getAllBookings, getTourGuideProfile } from "../controllers/tourist/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/booking/create", createBooking);

// Get all bookings
router.get("/bookings/get/:touristId", getAllBookings);
router.get("/booking/get/tour-guide/profile/:tourGuideId/:touristId", getTourGuideProfile);

// Route to create a new order
router.post("/create/order", createOrder);

// Delete a booking by ID
router.delete("/boooking/delete/:bookingId", cancelBooking);

export default router;
