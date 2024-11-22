import express from "express";
import { getAdvertisers, updateProfile, getProfile, createActivity,getAdvertiserActivityRevenue, deleteAdvertiserAccount,updateActivity,getAllActivitiesByAdvertiser  } from "../controllers/advertiser/advertiser.user.controller.js";

const router = express.Router();

router.put("/advertiser/profile/:id", updateProfile);
router.get("/advertiser/profile/:id", getProfile);
router.get('/advertiser/get', getAdvertisers);

router.delete('/advertiser/delete/:advertiserId', deleteAdvertiserAccount);

router.post("/advertiser/activity/create", createActivity);
router.put("/advertiser/activity/:advertiserId/:activityId", updateActivity);
router.get("/advertiser/activity/:advertiserId", getAllActivitiesByAdvertiser);
router.get('/advertiser/:id/activityRevenue', getAdvertiserActivityRevenue);


export default router;
