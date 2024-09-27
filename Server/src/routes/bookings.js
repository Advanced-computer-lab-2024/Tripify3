import express from "express";
import {book} from "../controllers/bookings_controller.js";


const router = express.Router();


router.post("/access/book", book);



export default router;
