import express from "express";
import { getPlace, addPlace,getAllPlaces,updatePlace,getPlacesByGovernor,deletePlace,createTag } from "../controllers/tourismGovernor/tourismGovernor.controller.js";
const router = express.Router();

router.post("/governor/addPlace", addPlace);
router.get("/governor/getAllPlaces", getAllPlaces);
router.get("/governor/getPlace/:id", getPlace);
router.route("/governor/:id").get(getPlacesByGovernor).put(updatePlace).delete(deletePlace);
router.post("/governor/createTag",createTag);


export default router;