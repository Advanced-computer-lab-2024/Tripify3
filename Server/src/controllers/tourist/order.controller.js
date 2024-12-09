import Tourist from "../../models/tourist.js";
import Order from "../../models/order.js";
import Product from "../../models/product.js";
import Review from "../../models/review.js";
import PromoCode from "../../models/promoCode.js";
import User from "../../models/user.js";
import Notification from "../../models/notification.js";
import Cart from "../../models/cart.js";
import Payment from "../../models/payment.js";
import Produt from "../../models/product.js";

import { sendOutOfStockNotificationEmailToSeller, sendOutOfStockNotificationEmailToAdmin } from "../../middlewares/sendEmail.middleware.js";
// Controller to get past and upcoming orders based on dropOffDate

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

    console.log(pastOrders);
    console.log("====================================");
    console.log(upcomingOrders);

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
  const promoCode = req.body.promoCode;
  const paymentMethod = req.body.paymentMethod;
  const deliveryFee = req.body.deliveryFee;

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

    if (promoCode) {
      cartDetails.promoCode = promoCode / 100;
    }

    await cartDetails.save();

    // Create a new order with the cart details and tourist ID
    const order = new Order({
      tourist: userId,
      cart: cartDetails._id,
      dropOffLocation: req.body.dropOffLocation,
      dropOffDate: req.body.dropOffDate,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Unpaid" : "Paid",
      deliveryFee,
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
        let sellerId;
        if (product.sellerId?.id) {
          // Safely check if sellerId and its _id exist
          sellerId = product.sellerId._id;
        }
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

    let notificationMessage;

    // Send out-of-stock notifications to each seller with relevant products
    for (const sellerId in outOfStockProductsBySeller) {
      const { seller, products } = outOfStockProductsBySeller[sellerId];
      if (!seller) {
        console.log(`Skipping sellerId: ${sellerId} as seller is undefined.`);
        continue; // Move to the next iteration
      }

      const productNames = products.join(", ");

      await sendOutOfStockNotificationEmailToSeller(seller, productNames);

      // Create a suitable message for the notification
      notificationMessage = `The following products are out of stock: ${productNames}. Please restock them to continue sales.`;
      // Save the notification in the database
      const notification = new Notification({
        user: sellerId, // Assuming `seller` is the seller's user ID
        message: notificationMessage,
      });

      await notification.save();
    }

    // Notify all admins for all out-of-stock products
    const adminUsers = await User.find({ type: "Admin" });
    // Flatten all products grouped by sellers into a single list
    const outOfStockProductNames = Object.values(outOfStockProductsBySeller).flatMap((sellerInfo) => sellerInfo.products);
    if (outOfStockProductNames.length > 0) {
      for (const admin of adminUsers) {
        await sendOutOfStockNotificationEmailToAdmin(admin.email, outOfStockProductNames);

        // Create a suitable message for the notification
        notificationMessage = `The following products are out of stock: ${outOfStockProductNames}. Please take appropriate action to coordinate with sellers for restocking these items.`;
        // Save the notification in the database
        const notification = new Notification({
          user: admin._id, // Assuming `seller` is the seller's user ID
          message: notificationMessage,
        });

        await notification.save();
      }
    }
    // Respond with the new order details
    return res.status(201).json({
      message: "Order created successfully, inventory updated, and notifications sent",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const validatePromoCode = async (req, res) => {
  const { userId, code } = req.params;

  try {
    // Find the promo code for the given userId and code
    const promoCode = await PromoCode.findOne({ tourist: userId, code });

    if (!promoCode) {
      // Promo code not found
      return res.status(400).json({ message: "Promo code not found for this user." });
    }

    // Check if the promo code is already used or expired
    if (promoCode.used) {
      return res.status(400).json({ message: "Promo code has already been used." });
    }

    if (new Date() > promoCode.expiryDate) {
      return res.status(400).json({ message: "Promo code has expired." });
    }

    return res.status(200).json({
      message: "Promo code is valid.",
      promoCode, // Return the full promo code object
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from the request parameters
    const { location, label } = req.body; // Get location and label from the request body

    if (!location || !label) {
      return res.status(400).json({ message: "Location and label are required" });
    }

    const tourist = await Tourist.findById(userId); // Find the tourist by ID
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the new address to the addresses array
    tourist.addresses.push({ location, label });
    await tourist.save();

    res.status(201).json({ message: "Address added successfully", addresses: tourist.addresses });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from the request parameters
    const { addressId, location, label } = req.body; // Get address ID, location, and label from the request body

    if (!addressId || (!location && !label)) {
      return res.status(400).json({ message: "Address ID and at least one field to update are required" });
    }

    const tourist = await Tourist.findById(userId); // Find the tourist by ID
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the address by ID
    const address = tourist.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update the fields
    if (location) address.location = location;
    if (label) address.label = label;

    await tourist.save();

    res.status(200).json({ message: "Address updated successfully", addresses: tourist.addresses });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from the request parameters
    const { addressId } = req.body; // Get address ID from the request body

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    // Find the tourist and update addresses
    const tourist = await Tourist.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } }, // Remove the address with the specified ID
      { new: true } // Return the updated document
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ message: "Address deleted successfully", addresses: tourist.addresses });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from the request parameters

    const tourist = await Tourist.findById(userId); // Find the tourist by ID
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Addresses fetched successfully",
      addresses: tourist.addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Controller to cancel an order
export const cancelOrder = async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    // Fetch the order
    const order = await Order.findOne({ _id: orderId, tourist: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or not authorized" });
    }

    // Fetch the tourist
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Fetch and delete the cart
    const cart = await Cart.findById(order.cart);
    if (cart) {

       // Iterate over each product in the cart
       for (const cartProduct of cart.products) {
        const { product: productId, quantity } = cartProduct;

        // Fetch the product and update its quantity
        const product = await Product.findById(productId);
        if (product) {
          product.quantity += quantity; // Add the quantity back to the product's stock
          await product.save();
        }
      }

      await cart.deleteOne();
    }

    // Fetch and delete the payment associated with the cart
    const payment = await Payment.findOne({ cart: order.cart });
    if (payment) {
      if (order.paymentStatus === "Paid") {
        tourist.walletAmount += payment.amount; // Add the payment amount to the wallet
        await tourist.save();
      }
      await payment.deleteOne();
    }

    // Delete the order
    await order.deleteOne();

    return res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error("Error canceling the order:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
