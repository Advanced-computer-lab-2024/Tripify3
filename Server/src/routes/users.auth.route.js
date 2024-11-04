import express from "express";
import { login, signup, changePassword, resetPassword, sendVerificationCode, verifyVerificationCode ,userAcceptTerms, userDeleteAccount} from "../controllers/user/user.auth.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/users.auth.validation.js";
import { uploadFiles, getUploadedFiles, uploadProfilePicture, getProfilePicture } from "../controllers/user/file.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/access/user/login", validate(loginSchema, "body"), login);
// Signup route
router.post("/access/user/signup", signup);
// File upload route
router.post("/user/upload/documents", upload.fields([{ name: 'files', maxCount: 4 }]), uploadFiles);
router.put("/user/upload/picture", upload.fields([{ name: 'file', maxCount: 1 }]), uploadProfilePicture);

// Define the route to get user files
router.get('/user/:userId/files', getUploadedFiles);
router.get('/user/:userId/profile/picture', getProfilePicture);

router.put('/users/accept-terms/:id', userAcceptTerms);


router.post("/user/resetPassword", resetPassword); // Reset password after verification
router.post("/user/sendVerificationCode", sendVerificationCode); // Send verification code
router.post("/user/verifyVerificationCode", verifyVerificationCode); // Send verification code
router.put("/user/changePassword", validate(changePasswordSchema, "body"), changePassword);
// Route to delete user account
router.delete("/users/:id/delete", userDeleteAccount);


export default router;
