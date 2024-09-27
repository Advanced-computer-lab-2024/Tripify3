import express from "express";
import {addTourismGovern,addAdmin} from "../controllers/admin.user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createschema } from "../validation/admin.auth.validation.js";

const router = express.Router();

router.post("/access/admin/addTourismGovern", validate(createschema, "body"), addTourismGovern);
router.post("/access/admin/addAdmin", validate(createschema, "body"),  addAdmin);

export default router;