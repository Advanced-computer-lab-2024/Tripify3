import express from "express";
import { createComplaint, getComplaintsByUser } from "../controllers/tourist/complaint.controller.js";

const router = express.Router();

router.post("/complaints/create", createComplaint);
router.get("/complaints/user/:userId", getComplaintsByUser);

export default router;
