import express from "express";
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip } from "../controllers/trip/trip.controller.js";

const router = express.Router();

router.post("/trip/create", createTrip);

router.get("/trip/get", getTrips);

router.get("/trip/get/:id", getTripById);

router.put("/trip/update/:id", updateTrip);

router.delete("/trip/delete/:id", deleteTrip);

export default router;
