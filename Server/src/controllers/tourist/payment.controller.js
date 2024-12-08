import Activity from "../../models/activity.js";
import cron from "node-cron";
import Payment from "../../models/payment.js";
import Order from "../../models/order.js";
import Stripe from "stripe";
import Itinerary from "../../models/itinerary.js";
import Product from "../../models/product.js";
import Tourist from "../../models/tourist.js";
import Cart from "../../models/cart.js";
import PromoCode from "../../models/promoCode.js";
import Booking from "../../models/booking.js";
import dotenv from "dotenv";
import { sendPaymentReceiptEmail } from "../../middlewares/sendEmail.middleware.js";
dotenv.config(); // Load environment variables
// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const cancelPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.body;
  console.log(paymentIntentId);
  

  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  const { price } = req.body;
  console.log(price);
  console.log("1");
  

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EGP",
      amount: price * 100,
      automatic_payment_methods: { enabled: true },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

export const getConfig = (req, res) => {
  return res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

export const confirmOTP = (req, res) => {
  const { userId, otp } = req.body;

  if (OTPStore[userId] && OTPStore[userId] === parseInt(otp)) {
    delete OTPStore[userId];
    return res.status(200).json({ message: "OTP verified" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};

export const sendConfirmation = async (req, res) => {
  const { email, itemId, type, hotel, flight, transporation } = req.body;

  let booking;
  try {
    switch (type) {
      case "Activity":
        booking = await Activity.findById(itemId).select("name date location price category tags duration averageRating");
        break;
      case "Itinerary":
        booking = await Itinerary.findById(itemId).select("activity date location price category tags duration averageRating");
        break;
      case "Product":
        booking = await Product.findById(itemId);
        break;
      case "Hotel":
        booking = hotel;
        break;
      case "Flight":
        booking = flight;
        break;
      case "Transporation":
        booking = transporation;
        break;
      default:
        return res.status(400).json({ message: "Invalid booking type" });
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingDetails = `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Key</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
                </tr>
                ${Object.entries(booking.toObject())
                  .map(
                    ([key, value]) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${key}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Booking Confirmation",
      html: `
                <h1>Your booking is confirmed!</h1>
                <p>Details:</p>
                ${bookingDetails}
            `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ error: "Error sending confirmation email" });
      }
      res.status(200).json({ message: "Confirmation email sent" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { touristId, amount, paymentMethod, bookingId, promoCode, type } = req.body;
    console.log(promoCode);
    
    // Validate input
    if (!touristId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if the tourist exists
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    const totalPrice = amount;

    if (paymentMethod === "Wallet") {
      if (tourist.walletAmount < totalPrice) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
    }

    let discount = 0;
    if (promoCode) {

    const existingPromoCode = await PromoCode.findOne({ code: promoCode });

    if (existingPromoCode) {

      discount = existingPromoCode.discount || 0; // Get the discount value

      const cartId = tourist.cart; // Assuming cartId is stored in the Tourist schema

      if (cartId) {
        // Find the cart and update the promoCode
        const cart = await Cart.findById(cartId);
        if (cart) {
          console.log(cart);
          
          cart.promoCode = discount / 100; // Update promoCode with the discount value
          await cart.save();
          console.log(`Promo code updated in cart for user ${cart.promoCode}`);
        } else {
          console.log(`Cart with ID ${cartId} not found`);
        }
      }
      // Delete the promo code from the table
      await PromoCode.deleteOne({ _id: existingPromoCode._id });
      console.log(`Promo code ${promoCode} deleted successfully`);
    } else {
      console.log(`Promo code ${promoCode} not found`);
    }
  }

    // Check if bookingId exists and fetch booking details
    let tickets = 0;
    let totalAmount = amount; // Default to provided amount
    let bookingDetails = {};

    if (bookingId) {
      const booking = await Booking.findById(bookingId)
        .populate("activity", "name date") // Populate activity name if type is Activity
        .populate("itinerary", "name timeline"); // Populate itinerary name if type is Itinerary
        

      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      tickets = booking.tickets || 0;
      totalAmount = booking.price || totalAmount; // Use booking price if available

      if (booking.type === "Activity" && booking.activity) {
        bookingDetails = {
          type: "Activity",
          name: booking.activity.name,
          date: booking.activity.date,
        };
      } else if (booking.type === "Itinerary" && booking.itinerary) {
        bookingDetails = {
          type: "Itinerary",
          name: booking.itinerary.name,
          date: booking.itinerary.timeline.startTime
        };
      }

      await sendPaymentReceiptEmail(tourist, bookingDetails, tickets, totalAmount, discount );

    }    
   

    // Create a new payment
    const payment = new Payment({
      tourist: touristId,
      amount,
      paymentMethod,
      cart: bookingId ? null : (tourist.cart || null), 
      booking: bookingId || null,
      type,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Completed",
    });

    // Save payment to the database
    const savedPayment = await payment.save();

    // Get cart details and check if wallet balance is sufficient

  
    // Calculate loyalty points based on total amount paid
    let loyaltyPoints = 0;
    if (tourist.loyaltyPoints <= 100000) {
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

    if (paymentMethod === "Wallet") {
      // Deduct total price from tourist's wallet
      tourist.walletAmount -= totalPrice;
    }
    await tourist.save(); // Save the updated tourist document
    
    return res.status(201).json({
      message: "Payment created successfully.",
      payment: savedPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating payment." });
  }
};


// Cron job runs daily at 1 AM
cron.schedule("15 23 * * *", async () => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight for accurate date comparison

    // Find all unpaid orders
    const unpaidOrders = await Order.find({ paymentStatus: "Unpaid", dropOffDate: { $lt: currentDate }, });

    for (const order of unpaidOrders) {
      // Update the order payment status to "Paid"
      order.paymentStatus = "Paid";
      await order.save();
      console.log(`Order with ID ${order._id} marked as Paid.`);

      // Find payments related to the cart in the order
      const relatedPayments = await Payment.find({ cart: order.cart, paymentStatus: "Pending" });

      for (const payment of relatedPayments) {
        // Update the payment status to "Completed"
        payment.paymentStatus = "Completed";
        await payment.save();
        console.log(`Payment with ID ${payment._id} marked as Completed.`);
      }
    }
  } catch (error) {
    console.error("Error during cron job execution:", error);
  }

  console.log("Cron job finished.");
});
