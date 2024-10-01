import express from "express";
import { login, signup, changePassword, resetPassword, sendVerificationCode, verifyVerificationCode } from "../controllers/users.auth.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/users.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/access/user/login", validate(loginSchema, "body"), login);
router.post("/access/user/signup", validate(signupSchema, "body"), signup);
router.post("/access/user/resetPassword", resetPassword); // Reset password after verification
router.post("/access/user/sendVerificationCode", sendVerificationCode); // Send verification code
router.post("/access/user/verifyVerificationCode", verifyVerificationCode); // Send verification code
router.put("/access/user/changePassword", validate(changePasswordSchema, "body"), changePassword);

export default router;
