import express from "express";
import { login, signup, changePassword } from "../controllers/tourist.user.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/tourist.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();
console.log("aaaa33")
router.post("/access/tourist/login", validate(loginSchema, "body"),  login);
router.post("/access/tourist/signup", validate(signupSchema, "body"), signup);
router.post("/access/tourist/changePassword", validate(changePasswordSchema, "body"), changePassword);

export default router;
