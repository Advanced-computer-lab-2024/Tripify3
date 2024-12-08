
import Payment from "../../models/payment.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import Order from "../../models/order.js";

export const GetAllPayments = async (req, res) => {
  try {
    const completedPayments = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          payments: {
            $push: {
              amount: "$amount",
              paymentMethod: "$paymentMethod",
              paymentDate: "$paymentDate",
              cartId: "$cart",
            },
          },
        },
      },
      {
        $project: {
          type: "$_id",
          totalAmount: 1,
          payments: 1,
          _id: 0,
        },
      },
    ]);

    // Process the payments to calculate admin/seller amounts
    for (const paymentGroup of completedPayments) {
      if (paymentGroup.type === "Product") {
        for (const payment of paymentGroup.payments) {
          const cart = await Cart.findById(payment.cartId).populate("products.product");
          if (!cart) continue;

          let adminTotal = 0;
          let sellerTotal = 0;

          for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            const productTotal = product.price * item.quantity;

            if (product.sellerId) {
              sellerTotal += productTotal;
            } else {
              adminTotal += productTotal;
            }
          }

          // Apply promo code if exists
          const discountMultiplier = cart.promoCode ? cart.promoCode : 0;
          adminTotal *= (1 - discountMultiplier);
          sellerTotal *= (1 - discountMultiplier);

          // Add calculated amounts to the payment
          payment.adminAmount = adminTotal;
          payment.sellerAmount = sellerTotal;

          // Remove cartId to clean up the response
          delete payment.cartId;
        }
      }
    }

    // If no payments are found
    if (completedPayments.length === 0) {
      return res.status(404).json({ message: "No completed payments found." });
    }

    return res.status(200).json({ completedPayments });
  } catch (error) {
    console.error("Error fetching completed payments:", error);
    return res.status(500).json({
      message: "An error occurred while fetching completed payments.",
      error,
    });
  }
};

export const getAllSellersRevenue = async (req, res) => {
  try {
    // Step 1: Fetch all orders with 'Paid' status
    const paidOrders = await Order.find({ paymentStatus: "Paid" }).populate("cart");

    let sellerRevenue = {};

    // Step 2: Iterate over orders and calculate revenue
    for (const order of paidOrders) {
      const cart = await Cart.findById(order.cart).populate("products.product");

      for (const cartItem of cart.products) {
        const product = cartItem.product;

        // Determine seller ID: prefer sellerId, fallback to adminId
        const sellerId = product.sellerId ? product.sellerId.toString() : product.adminId?.toString();

        if (sellerId) {
          // Initialize seller entry if not already present
          if (!sellerRevenue[sellerId]) {
            sellerRevenue[sellerId] = {
              sellerId,
              totalRevenue: 0,
              products: {},
            };
          }

          // Apply promo code if available
          const promoCode = cart.promoCode || 0; // Assuming promoCode is a discount percentage (e.g., 0.1 for 10% off)
          const revenueFromOrder = product.price * cartItem.quantity * (1 - promoCode);

          // Add product revenue to total for the seller
          sellerRevenue[sellerId].totalRevenue += revenueFromOrder;

          // Track product sales details
          if (!sellerRevenue[sellerId].products[product._id]) {
            sellerRevenue[sellerId].products[product._id] = {
              productId: product._id,
              name: product.name,
              price: product.price,
              quantitySold: 0,
              revenue: 0,
              orders: [],
            };
          }

          sellerRevenue[sellerId].products[product._id].quantitySold += cartItem.quantity;
          sellerRevenue[sellerId].products[product._id].revenue += revenueFromOrder;

          // Add order details to the orders array
          sellerRevenue[sellerId].products[product._id].orders.push({
            quantity: cartItem.quantity,
            date: order.orderDate, // Order creation date
            revenue: revenueFromOrder, // Revenue for this order
          });
        }
      }
    }

    // Convert sellerRevenue to an array and products to arrays for easier manipulation
    const sellerRevenueArray = Object.values(sellerRevenue).map((seller) => ({
      sellerId: seller.sellerId,
      totalRevenue: seller.totalRevenue,
      products: Object.values(seller.products),
    }));

    // Step 3: Return the response
    return res.status(200).json({
      sellers: sellerRevenueArray,
    });
  } catch (error) {
    console.error("Error fetching all sellers' revenue:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

