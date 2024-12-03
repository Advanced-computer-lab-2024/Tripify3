
import Payment from "../../models/payment.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";

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
          const discountMultiplier = cart.promoCode ? cart.promoCode : 1;
          adminTotal *= discountMultiplier;
          sellerTotal *= discountMultiplier;

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
