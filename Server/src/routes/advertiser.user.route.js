import express from "express";
import {getTags, getCategories, getAdvertisers, updateProfile, getProfile, deleteProfile, createActivity, updateActivity, getAllActivitiesByAdvertiser, deleteActivity } from "../controllers/advertiser/advertiser.user.controller.js";

const router = express.Router();

router.put("/advertiser/profile/:advertiserId", updateProfile);
router.get("/advertiser/profile/:advertiserId", getProfile);
router.delete("/advertiser/profile/:advertiserId", deleteProfile);
router.get('/advertiser/get', getAdvertisers);


router.post("/advertiser/activity", createActivity);
router.get("/advertiser/getTags", getTags);
router.get("/advertiser/getCategories", getCategories);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.delete("/advertiser/activity/:advertiserId/:activityId", deleteActivity);

export default router;
