import express from "express";
import { getCategories, getAdvertisers, updateProfile, getProfile, deleteProfile, createActivity, updateActivity, getAllActivitiesByAdvertiser, deleteActivity } from "../controllers/advertiser/advertiser.user.controller.js";

const router = express.Router();

router.put("/advertiser/profile/:id", updateProfile);
router.get("/advertiser/profile/:id", getProfile);
router.delete("/advertiser/profile/:id", deleteProfile);
router.get('/advertiser/get', getAdvertisers);


router.post("/activity/create", createActivity);
router.get("/category/get", getCategories);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.delete("/activity/delete", deleteActivity);

export default router;
