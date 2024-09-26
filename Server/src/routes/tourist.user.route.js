import express, { request } from "express";
import userController from "../controllers/tourist.user.controller.js";

const router = express.Router();

router.post("/access/tourist/login", userController.login);
router.post("/access/tourist/signup", userController.signup);
router.post("/access/tourist/changePassword", userController.changePassword);

export default router; 
