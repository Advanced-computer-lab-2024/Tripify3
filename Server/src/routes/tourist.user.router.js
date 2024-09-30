import express from 'express';
import { resetPassword, sendVerificationCode, verifyVerificationCode } from "../controllers/users.auth.controller.js";
const router = express.Router();


// Authentication Routes
router.post("/tourist/search/activity", resetPassword); // Reset password after verification
router.post("/tourist/filter/activity", sendVerificationCode); // Send verification code
router.post("/", verifyVerificationCode); // Send verification code

export default router;
