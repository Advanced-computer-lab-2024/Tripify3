import express from "express";
import { body } from "express-validator";
import { getUsers } from "../controllers/test_controller.js";
import { signupSchema } from "../validation/auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";
const router = express.Router();

router.post("/testing", validate(signupSchema, "body"), getUsers);

export default router;
