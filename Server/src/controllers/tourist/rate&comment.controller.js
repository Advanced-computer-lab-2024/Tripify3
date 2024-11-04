import Rating from "../../models/rating.js";
import User from "../../models/user.js";
import Comment from "../../models/comment.js";
import Tourist from "../../models/tourist.js";
import Itinerary from "../../models/itinerary.js"; // Adjust as per your file structure
import TourGuide from "../../models/tourGuide.js";
import Product from "../../models/product.js";
import Payment from "../../models/payement.js";
export const rateTourGuide = async (req, res) => {
  const { user, value } = req.body; // Rating value from request body
  const tourGuideId = req.params.tourGuideId; // Get Tour Guide ID from route parameters
  // Validate rating
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const userId = await User.findById(user); // Extract userId from the request (make sure to implement this function)
  const newRating = new Rating({ user: userId, tourGuide: tourGuideId, value });

  try {
    // Save the new rating
    const savedRating = await newRating.save();

    // Update the Tour Guide to include the rating in its record
    await TourGuide.findByIdAndUpdate(tourGuideId, { $push: { ratings: savedRating._id } });

    return res.status(201).json({ message: "Rating added successfully.", rating: savedRating });
  } catch (error) {
    console.error("Error adding rating:", error);
    return res.status(500).json({ message: "Error adding rating." });
  }
};

export const commentonTourGuide = async (req, res) => {
  const { user, content } = req.body; // User ID from request body
  const tourGuideId = req.params.tourGuideId; // Get Tour Guide ID from route parameters

  try {
    // Validate user existence and ensure it's a Tourist
    const tourist = await Tourist.findById(user); // Fetch the tourist and populate the following field
    console.log(tourist);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    console.log(tourGuideId);

    // Validate tour guide existence
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found." });
    }

    // Check if the tourist is following the tour guide
    const isFollowing = tourist.following && tourist.following.includes(tourGuideId);
    if (!isFollowing) {
      return res.status(403).json({ message: "You can only comment on tour guides you are following." });
    }

    // Create a new comment instance
    const newComment = new Comment({
      user: tourist._id, // Using the tourist's _id
      tourGuide: tourGuideId,
      content,
    });

    // Save the new comment
    const savedComment = await newComment.save();

    // Update the Tour Guide to include the new comment in its record
    await TourGuide.findByIdAndUpdate(tourGuideId, { $push: { comments: savedComment._id } });

    return res.status(201).json({ message: "Comment added successfully.", comment: savedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Error adding comment." });
  }
};

// Controller Method to rate an itinerary
const rateItinerary = async (req, res) => {
  const { itineraryId, value } = req.body;
  const userId = req.user._id; // Assumed that user ID is available in req.user

  try {
    // Validate inputs
    if (!itineraryId || !value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Check if itinerary ID is valid
    if (!mongoose.isValidObjectId(itineraryId)) {
      return res.status(400).json({ message: "Invalid itinerary ID" });
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Create a new rating
    const rating = new Rating({ user: userId, value });

    // Save the rating to the database
    await rating.save();

    // Add the rating ID to the itinerary ratings array
    itinerary.ratings.push(rating._id); // Assuming you have ratings field in your itinerary schema
    await itinerary.save();

    return res.status(201).json({ message: "Rating added successfully", rating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
// export const rateProduct = async (req, res) => {
//   try {
//     const { productId, rating } = req.body;

//     // Find the product and update its rating
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     product.rating = (product.rating * product.reviews.length + rating) / (product.reviews.length + 1);

//     await product.save();

//     return res.status(201).json({ message: "Rating added successfully", rating });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

// export const reviewProduct = async (req, res) => {
//   try {
//     const { productId, userId, rating, comment } = req.body;

//     // Create a new review object
//     const review = {
//       userId: mongoose.Types.ObjectId(userId),
//       rating,
//       comment,
//     };

//     // Find the product and update its reviews
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     product.reviews.push(review);

//     await product.save();

//     return res.status(201).json({ message: "Review added successfully", review });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

export const rateProduct = async (req, res) => {
  try {
    const { productId, userId, rating } = req.body;

    // Check if the user has made a successful payment for the product
    const payment = await Payment.findOne({ booking: productId, paymentStatus: "Success" }).populate("booking");
    if (!payment || payment.booking.tourist.toString() !== userId) {
      return res.status(403).json({ message: "You can only rate products you have purchased" });
    }

    // Find the product and update its rating
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the new average rating
    const totalRatings = product.reviews.length;
    product.rating = (product.rating * totalRatings + rating) / (totalRatings + 1);

    await product.save();

    return res.status(201).json({ message: "Rating added successfully", rating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const reviewProduct = async (req, res) => {
  try {
    const { productId, userId, comment } = req.body;

    // Check if the user has made a successful payment for the product
    const payment = await Payment.findOne({ booking: productId, paymentStatus: "Success" }).populate("booking");
    if (!payment || payment.booking.tourist.toString() !== userId) {
      return res.status(403).json({ message: "You can only review products you have purchased" });
    }

    // Create a new review object
    const review = {
      userId: mongoose.Types.ObjectId(userId),
      comment,
    };

    // Find the product and update its reviews
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push(review);

    await product.save();

    return res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export { rateItinerary };
