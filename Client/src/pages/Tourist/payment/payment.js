import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { price } = useParams();
  const [elementsKey, setElementsKey] = useState(0); // Unique key for forcing Elements to re-render
  const [promoCode, setPromoCode] = useState(""); // State to track promo code
  const [discountedPrice, setDiscountedPrice] = useState(price); // Updated price after discount
  const [isPromoValid, setIsPromoValid] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/tourist/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const createPaymentIntent = async (newPrice, promoCode="", isPromo) => {
    const response = await fetch("http://localhost:8000/tourist/create/payment/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: newPrice }),
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
      <h1>React Stripe and the Payment Element</h1>
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
