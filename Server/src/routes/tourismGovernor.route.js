import express from "express";
import { getPlace, addPlace,updatePlace,getPlacesByGovernor,deletePlace,createTag } from "../controllers/tourismGovernor/tourismGovernor.controller.js";
const router = express.Router();

router.post("/governor/place/create", addPlace);
router.get("/governor/place/get/:id", getPlace);
router.route("/governor/:id").get(getPlacesByGovernor).put(updatePlace).delete(deletePlace);
router.post("/governor/tag/create",createTag);


export default router;