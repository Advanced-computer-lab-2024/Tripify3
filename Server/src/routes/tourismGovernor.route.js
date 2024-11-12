import express from "express";
import {  addPlace,updatePlace,deletePlace,createTag } from "../controllers/tourismGovernor/tourismGovernor.controller.js";
const router = express.Router();

router.post("/place/create", addPlace);
router.route("/governor/update/place/:id").put(updatePlace).delete(deletePlace);
router.post("/governor/tag/create",createTag);


export default router;