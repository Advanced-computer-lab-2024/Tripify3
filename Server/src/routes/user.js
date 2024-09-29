import express from "express";
import { login, signup,addBooking} from "../controllers/user_controller.js";
import { loginSchema,signupSchema } from "../validation/user.auth.validation.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();
router.post("/user/book", addBooking)
router.post("/access/user/login",validate(loginSchema, "body"), login);
router.post("/access/user/signup",validate(signupSchema, "body"), signup);


export default router;