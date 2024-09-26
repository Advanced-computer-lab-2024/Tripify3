import express, { request } from "express";
import userController from "../controllers/tourist.user.controller.js";
import {signupSchema} from "../validation/auth.validation.js";
import {validate} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/access/tourist/login", userController.login);
router.post("/access/tourist/signup",  validate(signupSchema, "body"),  userController.signup);
router.post("/access/tourist/changePassword", userController.changePassword);

export default router; 
