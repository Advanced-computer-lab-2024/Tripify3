import express from "express";
import { createProfile, updateProfile, getProfile, deleteProfile } from "../controllers/advertiser.user.controller.js";
import { signupSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/advertiser/createProfile", validate(signupSchema, "body"), createProfile);
router.put("/advertiser/updateProfile/:username", updateProfile);
router.get("/advertiser/getProfile/:username", getProfile);
router.delete("/advertiser/deleteProfile/:username", deleteProfile);

export default router;
