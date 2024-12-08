import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { price, delivery } = useParams();
  const [elementsKey, setElementsKey] = useState(0); // Unique key for forcing Elements to re-render
  const [promoCode, setPromoCode] = useState(""); // State to track promo code
  const [discountedPrice, setDiscountedPrice] = useState(price); // Updated price after discount
  const [isPromoValid, setIsPromoValid] = useState(false);
  const deliveryPrice = delivery ? parseFloat(delivery) || 0 : 0;
  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: 'darkblue',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
  };

  const buttonHoverStyle = {
    transform: 'scale(1.1)',
  };

  useEffect(() => {
    fetch("http://localhost:8000/tourist/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const createPaymentIntent = async (newPrice, promoCode="", isPromo) => {
    const numericPrice = parseFloat(newPrice) || 0; // Ensure newPrice is treated as a number
    const totalPrice = numericPrice + deliveryPrice; // Perform arithmetic addition
    
  
    const response = await fetch("http://localhost:8000/tourist/create/payment/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: totalPrice }),
    });
    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
     // Increment key to force Elements to re-render

    setDiscountedPrice(newPrice); // Update the discounted price
    setIsPromoValid(isPromo); // Update the discounted price
     setElementsKey((prevKey) => prevKey + 1);
  };

 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      createPaymentIntent(price); // Debounced function call
    }, 300); // Wait for 300ms to prevent rapid calls

    return () => clearTimeout(timeoutId); // Cleanup on unmount or re-render
  }, [price]);

  return (
    <>
     <button
        onClick={() => navigate(-1)}
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.transform = buttonHoverStyle.transform)}
        onMouseOut={(e) => (e.target.style.transform = 'none')}
      >
        Go Back
      </button>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }} key={elementsKey} >
          <CheckoutForm
            clientSecret={clientSecret}
            setClientSecret={setClientSecret}
            createPaymentIntent={createPaymentIntent}
            originalPrice={price}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            isPromoValid={isPromoValid}
            setIsPromoValid={setIsPromoValid}
            discountedPrice={discountedPrice}
          />
        </Elements>
      )}
    </>
  );
}

export default Payment;
