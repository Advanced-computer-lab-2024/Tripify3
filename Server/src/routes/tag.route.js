import express from "express";
import { getTags, createTag, deleteTag, updateTag} from "../controllers/tag/tag.controller.js";

const router = express.Router();

router.get("/tag/get", getTags);
router.post("/tag/create", createTag);
router.delete("/tag/delete/:id", deleteTag);
router.put("/tag/update",updateTag);

export default router;
