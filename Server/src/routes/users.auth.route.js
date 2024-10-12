import express from "express";
import { login, signup, changePassword, resetPassword, sendVerificationCode, verifyVerificationCode } from "../controllers/user/user.auth.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/users.auth.validation.js";
import { uploadFiles, getUploadedFiles } from "../controllers/user/file.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/access/user/login", validate(loginSchema, "body"), login);
// Signup route
router.post("/access/user/signup", signup);
// File upload route
router.post("/user/upload", upload.fields([{ name: 'files', maxCount: 10 }]), uploadFiles);

// Define the route to get user files
router.get('/user/:userId/files', getUploadedFiles);


router.post("/access/user/resetPassword", resetPassword); // Reset password after verification
router.post("/access/user/sendVerificationCode", sendVerificationCode); // Send verification code
router.post("/access/user/verifyVerificationCode", verifyVerificationCode); // Send verification code
router.put("/access/user/changePassword", validate(changePasswordSchema, "body"), changePassword);

export default router;
