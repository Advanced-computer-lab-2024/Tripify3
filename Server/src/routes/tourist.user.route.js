import express from "express";
import { login, signup, changePassword,cancelbooking } from "../controllers/tourist.user.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/tourist.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();
router.post("/access/tourist/login", validate(loginSchema, "body"),  login);
router.post("/access/tourist/signup", validate(signupSchema, "body"), signup);
router.post("/access/tourist/changePassword", validate(changePasswordSchema, "body"), changePassword);
router.delete("/access/tourist/deletebooking",cancelbooking );

export default router;
