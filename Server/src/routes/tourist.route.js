import express from "express";

import { getAllActivitiesAttended } from "../controllers/tourist/activities.controller.js";
import {
  getProfile,
  editProfile,
} from "../controllers/tourist/profile.controller.js";
import {
  getFlightsData,
  getHotels,
  getDirections,
  getSuggestions,
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
import {
  redeemPoints,
  deleteTouristAccount,
} from "../controllers/tourist/profile.controller.js";
import { touristReview } from "../controllers/tourist/review.controller.js";
import {
  getFollowingTourGuides,
  followTourGuide,
} from "../controllers/tourist/pastfollowed.controller.js";
import {
  getConfig,
  createPayment,
  createPaymentIntent,
  confirmOTP,
} from "../controllers/tourist/payment.controller.js";
import {
  cancelBooking,
  createBooking,
} from "../controllers/tourist/booking.controller.js";
import { updateItinerariesAttended } from "../controllers/tourist/itineraries.controller.js";
import { getComplaintsForTourist } from "../controllers/tourist/complaint.controller.js";
import { checkoutTouristCart } from "../controllers/tourist/order.controller.js";
const router = express.Router();

router.get("/tourist/profile/:id", getProfile); // Get filtered activities
router.put("/tourist/profile/:id", editProfile); // Get filtered activities
router.get("/flights", getFlightsData); // Get Flights
router.get("/hotels", getHotels); //Get Hotels
router.get("/directions", getDirections); //Get Hotels
router.get("/suggestions", getSuggestions); //Get Hotels

router.get("/activitiesAttended/get/:userId", getAllActivitiesAttended); // Get all activities attended by a tourist

router.delete("/tourist/delete/:id", deleteTouristAccount);
//Complaints
router.get("/tourist/complaints/:id", getComplaintsForTourist);
router.post("/tourist/profile/:id/redeem", redeemPoints);

//rate and comment on t
router.post("/tourist/review", touristReview);
router.get("/tourist/following/get/:touristId", getFollowingTourGuides);
router.post("/tourist/follow/:touristId/:tourGuideId", followTourGuide);

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
router.put("/tourist/itinerary/attend", updateItinerariesAttended); //attend itinerary
router.post("/tourist/booking/create", createBooking); // Create a booking

//
router.get("/tourist/payment/config", getConfig); // Cancel booking
// // router.post("/tourist/create/payment", getConfig); // Cancel booking
// router.post("/tourist/create/payment/intent", getConfig); // Cancel booking
// router.post("/tourist/config", getConfig); // Cancel booking

//checkout to order
router.post("/tourist/checkout", checkoutTouristCart);

export default router;
