import express from "express";
import { createProfile, updateProfile, getProfile, deleteProfile } from "../controllers/advertiser.user.controller.js";
import { signupSchema } from "../validation/users.auth.validation.js";

const router = express.Router();

// router.post("/advertiser", createProfile);
router.post("/advertiser/createProfile", createProfile);
router.put("/advertiser/:username", updateProfile);
router.get("/advertiser/:username", getProfile);
router.delete("/advertiser/:username", deleteProfile);

export default router;
