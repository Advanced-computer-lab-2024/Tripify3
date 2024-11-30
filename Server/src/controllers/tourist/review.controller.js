import Tourist from "../../models/tourist.js";
import TourGuide from "../../models/tourGuide.js";
import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Place from "../../models/place.js";
import Product from "../../models/product.js";
import Review from "../../models/review.js";

export const touristReview = async (req, res) => {
  const { tourGuide, activity, product, itinerary, tourist, rating, comment, place, booking, order } = req.body;

  try {
    // 1. Validate input
    if (!tourist) {
      
      return res.status(400).json({ message: "Tourist ID is required." });
    }

    if (!rating && !comment) {
      return res.status(400).json({ message: "Either Rating or Comment is required." });
    }


    // 2. Find the tourist to check if they follow the tourist being reviewed
    const user = await Tourist.findById(tourist);


    if (!user) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // 3. Check if a review already exists based on specified criteria
    let existingReview;
    if (activity || itinerary ) {
      existingReview = await Review.findOne({
        tourist,
        booking,
        $or: [{ activity }, { itinerary  }],
      });
    } else if (product && order) {
      existingReview = await Review.findOne({
        tourist,
        product,
        order,
      });
    } else if(tourGuide){
      existingReview = await Review.findOne({
        tourist,
        booking,
        tourGuide,
      });
    }

    if (existingReview) {
      // Update the existing review
      // if (rating === null || rating === 0) {
        existingReview.comment = comment;
      // } else {
        existingReview.rating = rating;
      // }

      await existingReview.save();

        // Fetch all reviews related to the item and calculate the new average rating
        const allReviews = await Review.find({
          $or: [{ tourGuide: tourGuide || null }, { activity: activity || null }, { itinerary: itinerary || null }, { place: place || null }, { product: product || null }],
        });
  
        const totalRatings = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = Math.min(5, (totalRatings / allReviews.length).toFixed(1));

        let model;
        if (tourGuide) {
          model = await TourGuide.findById(tourGuide);
        } else if (activity) {
          model = await Activity.findById(activity);
        } else if (itinerary) {
          model = await Itinerary.findById(itinerary);
        } else if (place) {
          model = await Place.findById(place);
        } else if (product) {
          model = await Product.findById(product);
        }

        if (!model) {
          return res.status(404).json({ message: "Reviewed item not found." });
        }
    
         // Update the model's rating attribute
    model.rating = avgRating;
    await model.save();
  

      return res.status(200).json({ message: "Review updated successfully!", review: existingReview });
    }

    // 4. Create a new review
    const newReview = new Review({
      tourGuide,
      activity,
      itinerary,
      place,
      product,
      tourist,
      rating,
      comment,
      booking,
      order,
    });

    await newReview.save();

    // 4. Calculate the new average rating for the reviewed item
    let model;
    if (tourGuide) {
      model = await TourGuide.findById(tourGuide);
    } else if (activity) {
      model = await Activity.findById(activity);
    } else if (itinerary) {
      model = await Itinerary.findById(itinerary);
    } else if (place) {
      model = await Place.findById(place);
    } else if (product) {
      model = await Product.findById(product);
    }

    if (!model) {
      return res.status(404).json({ message: "Reviewed item not found." });
    }

    // Fetch all reviews related to the item and calculate the new average rating
    const allReviews = await Review.find({
      $or: [{ tourGuide: tourGuide || null }, { activity: activity || null }, { itinerary: itinerary || null }, { place: place || null }, { product: product || null }],
    });

    const totalRatings = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = Math.min(5, Math.round(totalRatings / allReviews.length)); // Cap at 5

    // Update the model's rating attribute
    model.rating = avgRating;
    await model.save();

    // 5. Respond with the created review
    return res.status(201).json({ message: "Review created successfully!", review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
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
      case "Itinerary":
        reviewQuery.itinerary = itemId;
        break;
      case "Activity":
        reviewQuery.activity = itemId;
        break;
      case "Product":
        reviewQuery.product = itemId;
        break;
      case "TourGuide":
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


export const getReview = async (req, res) => {
  const { booking, itemId, type, tourist } = req.params;

  try {
    // Validate input parameters
    if (!booking || !itemId || !type || !tourist) {
      return res.status(400).json({ message: "Booking, itemId, type, and tourist are required." });
    }

    // Check if type is valid
    if (!["activity", "itinerary"].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Type must be either 'activity' or 'itinerary'." });
    }

    // Define the search criteria based on type
    let itemCriteria = { _id: itemId };
    let model;
    let review;

    if (type.toLowerCase() === "activity") {
      model = Activity;

      review = await Review.findOne({ tourist, booking, [type]: itemId });
      if (review) {
        return res.status(200).json({ message: "Review found successfully", review: review });
      } else {
        return res.status(200).json({ message: "No review found.", review: {} });
      }
    } else if (type.toLowerCase() === "itinerary") {
      model = Itinerary;
      const itinerary = await Itinerary.findById(itemId);

      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found." });
      }
      const tourGuideId = itinerary.tourGuide;
   

      // Then, search for a review from this tourist for this tour guide on the given booking
      const tourGuideReview = await Review.findOne({ tourist, booking, tourGuide: tourGuideId });

      review = await Review.findOne({ tourist, booking, [type]: itemId });
      if (review) {
        return res.status(200).json({ message: "Review found successfully", tourGuideReview, review });
      } else {
        return res.status(200).json({ message: "No review found.", review: {} });
      }
    }
    // Search for an existing review by tourist and booking

    // Return review if found, otherwise empty response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};
