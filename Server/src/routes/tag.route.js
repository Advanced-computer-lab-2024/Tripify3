import express from "express";
import { getTags} from "../controllers/tag/tag.controller.js";

const router = express.Router();

router.get("/tag/get", getTags);

export default router;
