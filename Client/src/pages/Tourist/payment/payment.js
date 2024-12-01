import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { price } = useParams(); // Retrieve the price from the route params

  useEffect(() => {
    fetch("http://localhost:8000/tourist/payment/config").then(async (r) => {
      const { publishableKey } = await r.json();
      
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => { 
    
    fetch("http://localhost:8000/tourist/create/payment/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify({price}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
      console.log(clientSecret);
      
    });
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
