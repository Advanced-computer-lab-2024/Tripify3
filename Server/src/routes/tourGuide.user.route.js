import express from "express";
import { login, signup} from "../controllers/tour.guide.controller.js";
import { signupSchema, loginSchema } from "../validation/tourguide.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();
console.log("aaaa1")

router.post("/access/tourGuide/login", validate(loginSchema, "body"),  login);
router.post("/access/tourGuide/signup", validate(signupSchema, "body"), signup);


export default router;
