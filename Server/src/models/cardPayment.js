import mongoose from "mongoose";

const cardPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user making the payment
  cardNumber: {
    type: String,
    required: true, // Encrypted or masked card number
  },
  cardHolderName: {
    type: String,
    required: true, // Name of the cardholder
  },
  expiryDate: {
    type: String,
    required: true, // Expiry date of the card (MM/YY format)
  },
  cvv: {
    type: String,
    required: true, // Card Verification Value
  },
  amount: {
    type: Number,
    required: true, // Amount being charged
  },
  transactionDate: {
    type: Date,
    default: Date.now, // Timestamp for when the payment was made
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"], // Payment status
    default: "Pending",
  },
});

const cardPayment = mongoose.model("CardPayment", cardPaymentSchema);

export default cardPayment;
