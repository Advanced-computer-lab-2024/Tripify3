import express from "express";
import { createComplaint, getComplaintsByUser ,getAllComplaints } from "../controllers/tourist/complaint.controller.js";

const router = express.Router();

router.post("/complaints/create", createComplaint);
router.get("/complaints/user/:userId", getComplaintsByUser);
router.get("/complaints/get", getAllComplaints);

export default router;
