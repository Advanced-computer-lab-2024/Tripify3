import express from "express";
import { addPlace,getAllPlaces,updatePlace,getPlace,deletePlace,createTag } from "../controllers/tourism.governor.controller.js";
const router = express.Router();

router.post("/governor/addPlace", addPlace);
router.get("/governor/getAllPlaces", getAllPlaces);
router.route("/governor/:id").get(getPlace).put(updatePlace).delete(deletePlace);
router.post("/governor/createTag",createTag);


export default router;