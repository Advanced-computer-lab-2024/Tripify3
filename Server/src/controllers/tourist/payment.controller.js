import Activity from "../../models/activity.js";
import Payment from "../../models/payment.js";
import Stripe from "stripe";
import Itinerary from "../../models/itinerary.js";
import Product from "../../models/product.js";
import Tourist from "../../models/tourist.js";
import dotenv from "dotenv";
import { sendPaymentOTPEmail } from "../../middlewares/sendEmail.middleware.js";
dotenv.config(); // Load environment variables
// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { price } = req.body;

  console.log(req.body);
  

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
    console.log(e);

    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

export const getConfig = (req, res) => {
  // console.log(process.env.STRIPE_PUBLISHABLE_KEY);
  console.log("2992992");

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
    const { touristId, amount, paymentMethod, cartId, bookingId } = req.body;

    console.log(req.body);

    // Validate input
    if (!touristId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if the tourist exists
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      console.log("sjsjsjsjs");
      
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Create a new payment
    const payment = new Payment({
      tourist: touristId,
      amount,
      paymentMethod,
      cart: cartId || null,
      booking: bookingId || null,
    });

    // Save payment to the database
    const savedPayment = await payment.save();

    // Get cart details and check if wallet balance is sufficient

    const totalPrice = amount;

    if (paymentMethod === "Wallet") {
      if (tourist.walletAmount < totalPrice) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
    }
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
    console.log(error);    
    res.status(500).json({ message: "An error occurred while creating payment." });
  }
};
