import Tourist from "../../models/tourist.js";

import Order from "../../models/order.js";

export const checkoutTouristCart = async (req, res) => {
  const { userId } = req.query;
  console.log("this is the user id", userId);
  console.log("this is the req body", req.body);
  try {
    // Find the tourist by ID and check if they exist
    const tourist = await Tourist.findById(userId).populate("cart");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the user has a cart
    if (!tourist.cart) {
      return res
        .status(400)
        .json({ message: "No cart associated with this tourist" });
    }

    // Get cart details and delete the cart from the tourist's document
    const cartDetails = tourist.cart;

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
    // Respond with the new order details
    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
