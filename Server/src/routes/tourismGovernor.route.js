import express from "express";
import { getPlace, addPlace,updatePlace,getPlacesByGovernor,deletePlace,createTag } from "../controllers/tourismGovernor/tourismGovernor.controller.js";
const router = express.Router();

router.post("/place/create", addPlace);
router.get("/place/get/:id", getPlace);
router.route("/governor/get/places/:id").get(getPlacesByGovernor).put(updatePlace).delete(deletePlace);
router.post("/governor/tag/create",createTag);


export default router;