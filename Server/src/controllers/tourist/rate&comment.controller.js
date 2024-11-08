import User from "../../models/user.js";
import Tourist from "../../models/tourist.js";
import Itinerary from "../../models/itinerary.js"; 
import TourGuide from "../../models/tourGuide.js";
import Product from "../../models/product.js";
import Payment from "../../models/payment.js";
import Review from "../../models/review.js";

export const touristReview = async (req, res) => {
  const {tourGuide, activity, itinerary, touristId, rating, comment } = req.body;

  try {
    // 1. Validate input
    if (!touristId || !rating || !comment) {
      return res.status(400).json({ message: 'Tourist ID, Rating, and Comment are required.' });
    }

    // 2. Find the tourist to check if they follow the tourist being reviewed
    const tourist = await Tourist.findById(touristId)


    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }
  
    // 3. Check if the reviewed tourist is followed
    const reviewedTouristId = tourGuide; // This should be passed in the request body
    
    const isFollowing = tourist.following.some(followedTourist => followedTourist.equals(reviewedTouristId));

    if (!isFollowing) {
      return res.status(403).json({ message: 'You can only review tour guides you follow.' });
    }

    // 4. Create a new review
    const newReview = new Review({
      tourGuide,
      activity,
      itinerary,
      tourist: touristId,
      rating,
      comment,
    });

    await newReview.save();

    // 5. Respond with the created review
    return res.status(201).json({ message: 'Review created successfully!', review: newReview });

  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
