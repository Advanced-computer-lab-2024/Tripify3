import express from "express";
import { login, signup, changePassword } from "../controllers/tourist.user.controller.js";
import { signupSchema } from "../validation/auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/access/tourist/login", login);
router.post("/access/tourist/signup", validate(signupSchema, "body"), signup);
router.post("/access/tourist/changePassword", changePassword);

export default router;
