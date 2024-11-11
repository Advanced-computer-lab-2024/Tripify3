import Tourist from "../../models/tourist.js";
import Order from "../../models/order.js";
import Product from "../../models/product.js";
import Cart from "../../models/cart.js";
import Review from "../../models/review.js";
import { sendOutOfStockNotificationEmail } from "../../middlewares/sendEmail.middleware.js";
// Controller to get past and upcoming orders based on dropOffDate
import mongoose from "mongoose";

export const getOrders = async (req, res) => {
  const userId = req.params.userId; // tourist ID

  try {
    // Validate if the tourist exists
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Function to attach ratings to products
    const attachRatingsToProducts = async (orders) => {
      return Promise.all(
        orders.map(async (order) => {
          // Convert order to plain object
          order = order.toObject();

          // Loop through each product in the cart
          order.cart.products = await Promise.all(
            order.cart.products.map(async (productItem) => {
              // Find the relevant review for this product, order, and tourist
              const review = await Review.findOne({
                product: productItem.product._id,
                order: order._id,
                tourist: userId,
              });

              // Attach touristRating directly, no need to convert productItem
              productItem.touristRating = review ? review.rating : null;

              return productItem; // Return the modified product item
            })
          );

          return order; // Return the modified order with updated cart products
        })
      );
    };

    // Get past orders (where dropOffDate is in the past)
    const pastOrders = await Order.find({
      tourist: userId,
      dropOffDate: { $lt: new Date() },
    })
      .populate({
        path: "cart",
        populate: {
          path: "products.product",
          model: "Product",
        },
      })
      .sort({ dropOffDate: -1 });

    // Get upcoming orders (where dropOffDate is in the future)
    const upcomingOrders = await Order.find({
      tourist: userId,
      dropOffDate: { $gte: new Date() },
    })
      .populate({
        path: "cart",
        populate: {
          path: "products.product",
          model: "Product",
        },
      })
      .sort({ dropOffDate: 1 });

    // Attach ratings to past order products
    const pastOrdersWithRatings = await attachRatingsToProducts(pastOrders);

    return res.status(200).json({
      pastOrders: JSON.parse(JSON.stringify(pastOrdersWithRatings)),
      upcomingOrders: JSON.parse(JSON.stringify(upcomingOrders)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const checkoutTouristCart = async (req, res) => {
  const { userId } = req.query;
  try {
    // Find the tourist by ID and check if they exist
    const tourist = await Tourist.findById(userId).populate("cart");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the user has a cart
    if (!tourist.cart) {
      return res.status(400).json({ message: "No cart associated with this tourist" });
    }

    // Get cart details and check if wallet balance is sufficient
    const cartDetails = tourist.cart;
    const totalPrice = cartDetails.totalPrice;

    if (tourist.walletAmount < totalPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }
    // Calculate loyalty points based on total amount paid
    let loyaltyPoints = 0;
    if (tourist.loyaltyPoints  <= 100000) {
      // Level 1
      loyaltyPoints = totalPrice * 0.5;
    } else if (tourist.loyaltyPoints <= 500000) {
      // Level 2
      loyaltyPoints = totalPrice * 1;
    } else {
      // Level 3
      loyaltyPoints = totalPrice * 1.5;
    }

    // Add loyalty points to tourist's account
    tourist.loyaltyPoints = (tourist.loyaltyPoints || 0) + loyaltyPoints;

    // Deduct total price from tourist's wallet
    tourist.walletAmount -= totalPrice;
    await tourist.save(); // Save the updated tourist document

    // Create a new order with the cart details and tourist ID
    const order = new Order({
      tourist: userId,
      cart: cartDetails._id,
      dropOffLocation: req.body.dropOffLocation,
      dropOffDate: req.body.dropOffDate,
    });

    await order.save(); // Save the order
    tourist.cart = null; // Remove cart reference
    await tourist.save(); // Save the updated tourist document

    // Prepare a map to hold products grouped by seller whose stock becomes 0
    const outOfStockProductsBySeller = {};

    // Loop through each product in the cart and update product quantities and sales
    for (const item of cartDetails.products) {
      const product = await Product.findById(item.product).populate("sellerId");

      if (!product) continue; // Skip if product not found

      // Update the product quantity and sales fields
      const quantityPurchased = item.quantity;
      product.quantity -= quantityPurchased;
      // product.sales += product.price * quantityPurchased;
      product.sales += quantityPurchased;

      // If the product quantity reaches zero, add it to the outOfStockProductsBySeller map
      if (product.quantity <= 0) {
        const sellerId = product.sellerId._id;
        if (!outOfStockProductsBySeller[sellerId]) {
          outOfStockProductsBySeller[sellerId] = {
            seller: product.sellerId,
            products: [],
          };
        }
        outOfStockProductsBySeller[sellerId].products.push(product.name);
      }

      await product.save(); // Save the updated product document
    }

    // Send out-of-stock notifications to each seller with relevant products
    for (const sellerId in outOfStockProductsBySeller) {
      const { seller, products } = outOfStockProductsBySeller[sellerId];
      const productNames = products.join(", ");
      await sendOutOfStockNotificationEmail(seller, productNames);
    }

    // Respond with the new order details
    res.status(201).json({
      message: "Order created successfully, inventory updated, and notifications sent",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
