import express from 'express';
import stripeLib from 'stripe';
import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';
import Product from '../../models/product.js';
import User from '../../models/user.js';
import dotenv from "dotenv";
import { sendPaymentOTPEmail } from "../../middlewares/sendEmail.middleware.js";
dotenv.config(); // Load environment variables

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
const OTPStore = {};


export const createPayment = async (req, res) => {
    const { amount, currency, email } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency || "EUR",
            receipt_email: email,
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPaymentIntent = async (req, res) => {
    const { userId } = req.body;

    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        OTPStore[userId] = OTP;

        const tourist = await User.findById(userId);
        if (!tourist) {
          return res.status(404).json({ message: "Tourist not found." });
        }
    

        await sendPaymentOTPEmail(tourist, OTP);

    res.status(200).json({ message: "Verification code sent to email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getConfig = (req, res) => {
    console.log("aaaaaaaaaaaaaaaaaaa");
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    
    return res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};

export const confirmOTP = (req, res) => {
    const { userId, otp } = req.body;

    if (OTPStore[userId] && OTPStore[userId] === parseInt(otp)) {
        delete OTPStore[userId];
     return res.status(200).json({ message: 'OTP verified' });
    } else {
       return res.status(400).json({ message: 'Invalid OTP' });
    }
};

export const sendConfirmation = async (req, res) => {
    const { email, itemId, type, hotel, flight, transporation } = req.body;

    let booking;
    try {
        switch (type) {
            case 'Activity':
                booking = await Activity.findById(itemId).select('name date location price category tags duration averageRating');
                break;
            case 'Itinerary':
                booking = await Itinerary.findById(itemId).select('activity date location price category tags duration averageRating');
                break;
            case 'Product':
                booking = await Product.findById(itemId);
                break;
            case 'Hotel':
                booking = hotel;
                break;
            case 'Flight':
                booking = flight;
                break;
            case 'Transporation':
                booking = transporation;
                break;
            default:
                return res.status(400).json({ message: 'Invalid booking type' });
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const bookingDetails = `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Key</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
                </tr>
                ${Object.entries(booking.toObject()).map(([key, value]) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${key}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Booking Confirmation',
            html: `
                <h1>Your booking is confirmed!</h1>
                <p>Details:</p>
                ${bookingDetails}
            `,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending confirmation email' });
            }
            res.status(200).json({ message: 'Confirmation email sent' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
