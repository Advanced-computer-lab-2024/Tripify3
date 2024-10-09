import express from "express";
import {getTags, getCategories, getAdvertisers, updateProfile, getProfile, deleteProfile, createActivity, updateActivity, getAllActivitiesByAdvertiser, deleteActivity } from "../controllers/advertiser/advertiser.user.controller.js";

const router = express.Router();

router.put("/advertiser/updateProfile/:advertiserId", updateProfile);
router.get("/advertiser/getProfile/:advertiserId", getProfile);
router.delete("/advertiser/profile/:advertiserId", deleteProfile);
router.get('/advertiser/get', getAdvertisers);


router.post("/advertiser/activity", createActivity);
router.get("/getTags", getTags);
router.get("/getCategories", getCategories);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.delete("/activity", deleteActivity);

export default router;
