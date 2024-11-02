import express from "express";
import {
  getSortedItineraries,
  getFilteredItineraries,
} from "../controllers/tourist/itineraries.controller.js";
import { getAllActivities } from "../controllers/tourist/activities.controller.js";
import {
  getProfile,
  editProfile,
} from "../controllers/tourist/profile.controller.js";
import {
  searchPlaces,
  searchActivities,
  searchItineraries,
  getFlightsData,
} from "../controllers/tourist/search.controller.js";
import {
  initializeWishList,
  AddProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
} from "../controllers/tourist/wishList.contoller.js";
import {
  initializeCart,
  addToCart,
  getTouristCart,
  removeFromCart,
  Decrementor,
  updateCart,
} from "../controllers/tourist/cart.controller.js";
import { redeemPoints } from "../controllers/tourist/profile.controller.js";
const router = express.Router();

// GET request to filter places by type and/or tags
router.get("/tourist/itinerary/sort", getSortedItineraries); // Get sorted itineraries
router.get("/tourist/itinerary/filter", getFilteredItineraries); // Get filtered itineraries
router.get("/tourist/activity", getAllActivities); // Get all activities
router.get("/tourist/profile/:id", getProfile); // Get filtered activities
router.put("/tourist/profile/:id", editProfile); // Get filtered activities
router.get("/flights", getFlightsData); // Get Flights

router.post("/places/search", searchPlaces); // Search places
router.post("/activities/search", searchActivities); // Search activities
router.post("/itineraries/search", searchItineraries); // Search itineraries
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
