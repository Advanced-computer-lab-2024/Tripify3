import React, { useEffect, useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";

const VisaPayment = ({ clientSecret }) => {
  const [key, setKey] = useState(0);

  // Refresh the PaymentElement when clientSecret changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1); // Increment key to force re-render
  }, [clientSecret]);

  return (
    <div key={key}>
      <PaymentElement id="payment-element" />
    </div>
  );
};

export default VisaPayment;
