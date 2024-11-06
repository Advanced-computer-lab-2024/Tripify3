import express from "express";
import {
  getSortedItineraries,
  getFilteredItineraries,
  bookItinerary
} from "../controllers/tourist/itineraries.controller.js";
import { getAllActivities,bookActivity } from "../controllers/tourist/activities.controller.js";
import {
  getProfile,
  editProfile,
} from "../controllers/tourist/profile.controller.js";
import {
  searchPlaces,
  searchActivities,
  searchItineraries,
  getFlightsData, getHotels,
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
import {touristReview} from "../controllers/tourist/rate&comment.controller.js";
import {getFollowingTourGuides,followTourGuide}from "../controllers/tourist/pastfollowed.controller.js"
import {cancelBooking} from "../controllers/tourist/booking.controller.js";
import {getAllCategories} from "../controllers/tourist/category.controller.js";
const router = express.Router();

router.get("/tourist/profile/:id", getProfile); // Get filtered activities
router.put("/tourist/profile/:id", editProfile); // Get filtered activities
router.get("/flights", getFlightsData); // Get Flights
router.get("/hotels", getHotels); //Get Hotels

//Complaints
router.post("/tourist/profile/:id/redeem", redeemPoints);

//category
router.get("/category/get", getAllCategories);

//rate and comment on t 
router.post('/tourist/review', touristReview);
router.get("/tourist/following/get/:touristId", getFollowingTourGuides);
router.post('/tourist/follow/:touristId/:tourGuideId', followTourGuide);


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

//Bookings
router.put("/tourist/booking/cancel", cancelBooking); // Cancel booking

export default router;
