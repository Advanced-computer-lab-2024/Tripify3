import express from "express";
import { getAdvertisers, updateProfile, getProfile, deleteProfile, createActivity, updateActivity, getAllActivitiesByAdvertiser, deleteActivity ,deleteAdvertiser } from "../controllers/advertiser/advertiser.user.controller.js";

const router = express.Router();

router.put("/advertiser/profile/:id", updateProfile);
router.get("/advertiser/profile/:id", getProfile);
router.delete("/advertiser/profile/:id", deleteProfile);
router.get('/advertiser/get', getAdvertisers);
router.delete('/advertiser/delete/:id', deleteAdvertiser);



router.post("/activity/create", createActivity);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.delete("/activity/delete", deleteActivity);

export default router;
