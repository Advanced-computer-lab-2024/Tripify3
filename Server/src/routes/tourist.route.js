import express from "express";
import { getProfile, editProfile } from "../controllers/tourist/profile.controller.js";
import { getFlightsData } from "../controllers/tourist/search.controller.js";
import { initializeWishList, AddProductToWishlist, getWishlist, removeProductFromWishlist } from "../controllers/tourist/wishList.contoller.js";
import { initializeCart, addToCart, getTouristCart, removeFromCart, Decrementor, updateCart } from "../controllers/tourist/cart.controller.js";
import { redeemPoints } from "../controllers/tourist/profile.controller.js";

import {getTouristComplaints , getAllTourists} from "../controllers/tourist/complaint.controller.js";
const router = express.Router();

router.get("/tourist/profile/:id", getProfile); // Get filtered activities
router.put("/tourist/profile/:id", editProfile); // Get filtered activities
router.get("/flights", getFlightsData); // Get Flights


//Complaints
router.get("/tourist/get", getAllTourists)
router.get("/tourist/complaints/:id", getTouristComplaints );

router.post("/tourist/profile/:id/redeem", redeemPoints);

// Wishlist
router.post("/initializeWishlist", initializeWishList);
router.put("/tourist/wishlist/Add", AddProductToWishlist); // Add product to wishlist
router.get("/tourist/wishlist/get", getWishlist); // Get wishlist
router.put("/tourist/wishlist/remove", removeProductFromWishlist); // Remove product from wishlist

// Cart
router.post("/initializeCart", initializeCart);
router.put("/tourist/cart/add", addToCart); // Add product to cart
router.get("/tourist/cart", getTouristCart); // Get cart
router.put("/tourist/cart/remove", removeFromCart); // Remove product from cart
router.put("/tourist/cart/decrement", Decrementor); // Decrement product quantity in cart
router.put("/tourist/cart/update", updateCart); // Update cart
export default router;
