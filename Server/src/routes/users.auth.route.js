import express from "express";
import { login, signup, changePassword, resetPassword, sendVerificationCode, verifyVerificationCode ,userAcceptTerms, userDeleteAccount, getProfile, getNotificationsByUserId, markAllNotificationsAsRead, logout} from "../controllers/user/user.auth.controller.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation/users.auth.validation.js";
import { deleteProfilePicture, uploadFiles, getUploadedFiles, uploadProfilePicture, getProfilePicture ,getUserDetails } from "../controllers/user/file.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/access/user/login", validate(loginSchema, "body"), login);
// Signup route
router.post("/access/user/signup", signup);
router.post("/access/user/logout", logout);
// File upload route
router.post("/user/upload/documents", upload.fields([{ name: 'files', maxCount: 4 }]), uploadFiles);
router.put("/user/upload/picture", upload.fields([{ name: 'file', maxCount: 1 }]), uploadProfilePicture);

// Define the route to get user files
router.get('/user/files/:userId', getUploadedFiles);
router.get('/user/profile/picture/:userId', getProfilePicture);

router.put('/user/accept-terms/:id', userAcceptTerms);
router.delete("/user/remove/picture", deleteProfilePicture);


router.post("/user/resetPassword", resetPassword); // Reset password after verification
router.post("/user/sendVerificationCode", sendVerificationCode); // Send verification code
router.post("/user/verifyVerificationCode", verifyVerificationCode); // Send verification code
router.get("/user/get/profile/:userId", getProfile); // Send verification code
router.put("/user/change/password",  changePassword);
// Route to delete user account
router.delete("/users/delete/:userId", userDeleteAccount);
router.get('/user/get/profile/:id', getUserDetails); // Add this route to fetch user details
// Route to get notifications for a specific user
router.get('/get/notifications/:userId', getNotificationsByUserId);

// Route to mark all notifications as read for a user
router.put('/notifications/read/:userId', markAllNotificationsAsRead);


export default router;
