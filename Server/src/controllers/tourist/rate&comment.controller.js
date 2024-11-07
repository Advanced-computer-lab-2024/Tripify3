import User from "../../models/user.js";
import Tourist from "../../models/tourist.js";
import Itinerary from "../../models/itinerary.js"; // Adjust as per your file structure
import TourGuide from "../../models/tourGuide.js";
import Product from "../../models/product.js";
import Payment from "../../models/payment.js";
import Review from "../../models/review.js";

export const touristReview = async (req, res) => {
  const { touristId, rating, comment, type, itemId } = req.body;

  const user = await Tourist.findById(touristId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check that either rating or comment exists
  if (!rating && !comment) {
    return res.status(400).json({ message: "Either rating or comment must be provided." });
  }

  // Validate rating if it exists
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    // Verify payment
    if(type != 'Tour Guide'){    
    const paymentExists = await Payment.findOne({
      tourist: touristId,
      'items.type': type,
      'items.itemId': itemId,
      paymentStatus: 'completed'
    });

    if (!paymentExists) {
      return res.status(403).json({ message: "You must pay for this item before rating or commenting." });
    }
  }else{
      // Check if the tour guide exists
      const tourGuide = await TourGuide.findById(itemId);
      if (!tourGuide) {
        return res.status(404).json({ message: "Tour guide not found." });
      }
  
      // Check if the tourist is already following the tour guide
      if (!user.following.includes(itemId)) {
        return res.status(400).json({ message: "You are not following this tour guide." });
      }
  }

    // Prepare review data
    const reviewData = { 
      tourist: touristId, 
      rating, 
      comment,
      reviewDate: new Date()
    };

    switch (type) {
      case 'Itinerary':
        const itineraryHasAttended = Tourist.itinerariesAttended.some(attendedItinerary => attendedItinerary.equals(itemId));
        if (!itineraryHasAttended) {
          return res.status(403).json({ message: "You must attend the itinerary to comment on it" });
        }
        reviewData.itinerary = itemId;
        break;
      case 'Activity':
        const activityHasAttended = Tourist.activitiesAttended.some(attendedactivity => attendedactivity.equals(itemId));
        if (!activityHasAttended) {
          return res.status(403).json({ message: "You must attend the itinerary to comment on it" });
        }
        reviewData.activity = itemId;
        break;
      case 'Product':
        reviewData.product = itemId;
        break;
      case 'TourGuide':
        reviewData.tourGuide = itemId;
        break;
      default:
        return res.status(400).json({ message: "Invalid item type." });
    }

    // Save the review
    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();

    return res.status(201).json({ message: "Review added successfully.", review: savedReview });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Error adding review." });
  }
};

export const touristEditReview = async (req, res) => {
  const { touristId, rating, comment, type, itemId } = req.body;

  // Validate that at least one of rating or comment is provided
  if (!rating && !comment) {
    return res.status(400).json({ message: "Either rating or comment must be provided." });
  }

  // Validate rating if provided
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    // Find the review to update
    const reviewQuery = { tourist: touristId };

    switch (type) {
      case 'Itinerary':
        reviewQuery.itinerary = itemId;
        break;
      case 'Activity':
        reviewQuery.activity = itemId;
        break;
      case 'Product':
        reviewQuery.product = itemId;
        break;
      case 'TourGuide':
        reviewQuery.tourGuide = itemId;
        break;
      default:
        return res.status(400).json({ message: "Invalid item type." });
    }

    // Update the review
    const updatedReview = await Review.findOneAndUpdate(
      reviewQuery,
      { rating, comment, reviewDate: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({ message: "Review updated successfully.", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Error updating review." });
  }
};
