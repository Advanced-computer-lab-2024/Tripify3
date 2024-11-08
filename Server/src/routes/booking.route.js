import express from "express";
import { createBooking, cancelBooking, getAllBookings } from "../controllers/tourist/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/booking/create", createBooking);

// Get all bookings
router.get("/booking/get/:touristId", getAllBookings);

// Delete a booking by ID
router.delete("/boooking/delete/:id", cancelBooking);

export default router;
