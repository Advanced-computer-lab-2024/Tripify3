import { PaymentElement } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import { getUserId } from "../../../utils/authUtils";
import { getUserProfile } from "../../../services/tourist";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VisaPayment from "./visaPayment.js";

export default function CheckoutForm({setIsPromoValid, isPromoValid, clientSecret, createPaymentIntent, originalPrice, promoCode, setPromoCode, discountedPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const { price, tickets, itemId, type, dropOffLocation, dropOffDate, delivery, details } = useParams(); // Retrieve the price from the route params
  const userId = getUserId();
  const deliveryPrice = delivery ? parseFloat(delivery) || 0 : 0;

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Visa");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setWalletAmount(response.data.userProfile.walletAmount); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const validatePromoCode = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/validate-promo/${userId}/${promoCode}`);
      if (response.status === 200) {
        const { discount } = response.data.promoCode;
        setDiscount(discount);
        setError(null);

        const initialPrice = parseFloat(price);
        const discountedPrice = initialPrice - (initialPrice * discount) / 100;        
        const newPrice = discountedPrice.toFixed(2); // Format to 2 decimal places

        if (clientSecret) {
          const paymentIntentId = clientSecret.split("_secret")[0];
          await axios.post("http://localhost:8000/tourist/cancel/payment/intent", { paymentIntentId });
        }

        // Create a new payment intent and update parent component
        await createPaymentIntent(newPrice, promoCode, true);

        setIsPromoValid(true); // Mark the promo code as valid
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Invalid promo code.");
      } else {
        setError("An error occurred while validating the promo code.");
      }
      setDiscount(0); // Reset discount
      setIsPromoValid(false); // Mark promo code as invalid
    }
  };

  const removePromoCode = async () => {
  

    if (clientSecret) {
      const paymentIntentId = clientSecret.split("_secret")[0];
      await axios.post("http://localhost:8000/tourist/cancel/payment/intent", { paymentIntentId });
    }

    await createPaymentIntent(originalPrice, "", false);
  
  };

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const resetPromoCode = () => {
    setPromoCode("");
    setDiscount(0);
    setIsPromoValid(false);
      removePromoCode();
    
  };
  

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      if (type === "Product") {
        await axios.post(`http://localhost:8000/tourist/create/payment`, {
          touristId: userId,
          amount: calculateFinalPrice(),
          paymentMethod: selectedMethod,
          promoCode,
          type,
        });

        await axios.post(`http://localhost:8000/tourist/checkout?userId=${userId}`, {
          dropOffLocation,
          dropOffDate,
          promoCode: discount,
          paymentMethod: selectedMethod,
          deliveryFee: deliveryPrice
        });
      } else {
        const booking = { tourist: userId, price: calculateFinalPrice(), type, itemId, tickets, details };

        const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);

        await axios.post(`http://localhost:8000/tourist/create/payment`, {
          touristId: userId,
          amount: calculateFinalPrice(),
          paymentMethod: selectedMethod,
          promoCode,
          bookingId: response.data.booking._id,
          type,
        });
      }
    } catch (err) {
      console.error("Error processing wallet payment:", err);
      setMessage("An error occurred during payment.");
    }

    if (selectedMethod !== "Visa") {
      setIsProcessing(false);
      navigate(`/tourist/payment/success`);
      return;
    }

    if (!stripe || !elements || selectedMethod !== "Visa") {
      if (selectedMethod === "Wallet") {
        setMessage("Wallet payments are not yet supported.");
      } else if (selectedMethod === "Cash on Delivery") {
        setMessage("Cash on Delivery selected. No payment processing needed.");
      }
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tourist/payment/success`,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  const calculateFinalPrice = () => {
    const initialPrice = parseFloat(discountedPrice);
  
    // const discountedPrice = initialPrice - (initialPrice * discount) / 100;
    return initialPrice + deliveryPrice; // Format to 2 decimal places
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      {/* Payment Method Selection */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => handlePaymentMethodChange("Visa")}
          style={{
            flex: 1,
            marginRight: "5px",
            backgroundColor: selectedMethod === "Visa" ? "#003366" : "#fff",
            color: selectedMethod === "Visa" ? "#fff" : "#000",
            border: "1px solid #003366",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          Visa
        </button>
        <button
          type="button"
          onClick={() => handlePaymentMethodChange("Wallet")}
          style={{
            flex: 1,
            marginRight: "5px",
            backgroundColor: selectedMethod === "Wallet" ? "#003366" : "#fff",
            color: selectedMethod === "Wallet" ? "#fff" : "#000",
            border: "1px solid #003366",
            borderRadius: "4px",
            padding: "10px",
          }}
        >
          Wallet
        </button>
        {type === "Product" && (
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("Cash on Delivery")}
            style={{
              flex: 1,
              backgroundColor: selectedMethod === "Cash on Delivery" ? "#003366" : "#fff",
              color: selectedMethod === "Cash on Delivery" ? "#fff" : "#000",
              border: "1px solid #003366",
              borderRadius: "4px",
              padding: "10px",
            }}
          >
            Cash on Delivery
          </button>
        )}
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {selectedMethod === "Wallet" && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}>Wallet Balance: {walletAmount} EGP</div>
          {walletAmount < calculateFinalPrice() && (
            <div style={{ color: "red", marginBottom: "10px" }}>Insufficient wallet balance. Please top up your wallet or select a different payment method.</div>
          )}
        </div>
      )}

      {selectedMethod != "Visa" && (
        <form id="payment-form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "14px", marginBottom: "5px", color: "#555" }}>Enter Promo Code</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={handlePromoCodeChange}
                disabled={isPromoValid}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginRight: "5px",
                  backgroundColor: isPromoValid ? "#f9f9f9" : "#fff",
                  cursor: isPromoValid ? "not-allowed" : "text",
                }}
              />
              {!isPromoValid ? (
                <button
                  type="button"
                  onClick={validatePromoCode}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#003366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetPromoCode}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              )}
            </div>
            {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}
          </div>

          <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>Total Price: {calculateFinalPrice()} EGP</div>

          <button
            disabled={isProcessing || !stripe || !elements || (walletAmount < calculateFinalPrice())}
            id="submit"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "10px",
              backgroundColor: (walletAmount < calculateFinalPrice()) ? "#a9a9a9" : "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor:  (walletAmount < calculateFinalPrice()) ? "not-allowed" : "pointer", // No pointer events when disabled
              opacity: (walletAmount < calculateFinalPrice()) ? 0.6 : 1, // Dim the button
            }}
          >
            <span id="button-text">{isProcessing ? "Processing..." : "Pay now"}</span>
          </button>
        </form>
      )}

      {/* Payment Form */}
      {selectedMethod === "Visa" && (
        <form id="payment-form" onSubmit={handleSubmit}>
        
        <VisaPayment clientSecret={clientSecret} />

          <div style={{ marginBottom: "10px", marginTop: "10px" }}>
            <div style={{ fontSize: "14px", marginBottom: "5px", color: "#555" }}>Enter Promo Code</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={handlePromoCodeChange}
                disabled={isPromoValid}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginRight: "5px",
                  backgroundColor: isPromoValid ? "#f9f9f9" : "#fff",
                  cursor: isPromoValid ? "not-allowed" : "text",
                }}
              />
              {!isPromoValid ? (
                <button
                  type="button"
                  onClick={validatePromoCode}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#003366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetPromoCode}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              )}
            </div>
            {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}
          </div>

          <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>Total Price: {calculateFinalPrice()} EGP</div>

          <button
            disabled={isProcessing || !stripe || !elements}
            id="submit"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "10px",
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <span id="button-text">{isProcessing ? "Processing..." : "Pay now"}</span>
          </button>
        </form>
      )}

      {/* Message Display */}
      {message && (
        <div id="payment-message" style={{ marginTop: "20px", color: "red" }}>
          {message}
        </div>
      )}
    </div>
  );
}
