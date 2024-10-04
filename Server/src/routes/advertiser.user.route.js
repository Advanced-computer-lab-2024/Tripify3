import express from "express";
import { createProfile, updateProfile, getProfile, deleteProfile, createActivity, updateActivity, getAllActivitiesByAdvertiser, deleteActivity } from "../controllers/advertiser/advertiser.user.controller.js";
import { signupSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/advertiser/profile", validate(signupSchema, "body"), createProfile);
router.put("/advertiser/profile/:advertiserId", updateProfile);
router.get("/advertiser/profile/:advertiserId", getProfile);
router.delete("/advertiser/profile/:advertiserId", deleteProfile);

router.post("/advertiser/activity", createActivity);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.delete("/advertiser/activity/:advertiserId/:activityId", deleteActivity);

export default router;
