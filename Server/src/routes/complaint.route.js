import express from "express";
import { createComplaint, handleAdminReply, getAllComplaints } from "../controllers/tourist/complaint.controller.js";

const router = express.Router();

router.post("/complaint/create", createComplaint);
router.post("/admin/complaint/reply", handleAdminReply);
router.get("/complaints/get", getAllComplaints);

export default router;
