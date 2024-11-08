// import { PaymentElement } from "@stripe/react-stripe-js";
// import { useState, useEffect } from "react";
// import { useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [message, setMessage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [clientSecret, setClientSecret] = useState("");
//   const [showOtpPopup, setShowOtpPopup] = useState(false);
//   const [showPointsAnimation, setShowPointsAnimation] = useState(false);
//   const [loyaltyPoints, setLoyaltyPoints] = useState(0);
//   const [totalPoints, setTotalPoints] = useState(0);

//   useEffect(() => {
//     const storedClientSecret = localStorage.getItem("clientSecret");
//     if (storedClientSecret) {
//       setClientSecret(storedClientSecret);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const response = await fetch("http://localhost:8000/payment/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: localStorage.getItem("paymentEmail") }),
//       });

//       const data = await response.json();
//       console.log(data.clientSecret);
//       if (data.sent) {
//         setShowOtpPopup(true);
//         setMessage("OTP sent to your email. Please enter it to confirm.");
//       } else {
//         setMessage("Failed to create payment intent.");
//       }
//     } catch (error) {
//       setMessage("An error occurred during payment creation.");
//       console.error("Error:", error);
//     }

//     setIsProcessing(false);
//   };

//   const handleOtpSubmit = async () => {
//     if (!otp) {
//       setMessage("Please enter the OTP.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/payment/confirm-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: localStorage.getItem("paymentEmail"),
//           otp,
//         }),
//       });

//       const result = await response.json();
//       console.log(result.message);

//       if (result.message === "OTP verified") {
//         const { error } = await stripe.confirmPayment({
//           elements,
//           confirmParams: {
//             return_url: `${window.location.origin}/completion`,
//           },
//           redirect: "if_required",
//         });

//         if (error) {
//           setMessage(error.message);
//         } else {
//           setMessage("Payment succeeded!");
//           // Trigger loyalty points update after payment is successful
//           handleLoyaltyPointsUpdate();
//         }

//         setShowOtpPopup(false);
//       } else {
//         setMessage("Invalid OTP.");
//       }
//     } catch (error) {
//       setMessage("Failed to confirm OTP.");
//       console.error("Error:", error);
//     }
//   };

//   const handleLoyaltyPointsUpdate = async () => {
//     const price = localStorage.getItem("price");
//     const userName = localStorage.getItem("userName");

//     if (!price || !userName) {
//       setMessage("Price or user name not found.");
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:8000/touristRoutes/loyalty/${userName}`, {
//         params: { price }
//       });

//       if (response.data.success) {
//         // Start the animation
//         setShowPointsAnimation(true);

//         // Update loyalty points
//         setLoyaltyPoints(response.data.points);
//         setTotalPoints(response.data.points);

//         // Display the final message after animation
//         setTimeout(() => {
//           setMessage(`You have earned ${response.data.points} loyalty points. You now have ${response.data.points} total points.`);
//           setShowPointsAnimation(false);
//         }, 3000);  // Delay message until after animation
//       } else {
//         setMessage("Failed to update loyalty points.");
//       }
//     } catch (error) {
//       setMessage("Error updating loyalty points.");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "80vh",
//       backgroundColor: "#f9f9f9",
//       padding: "20px",
//     }}>
//       <div style={{
//         backgroundColor: "#ffffff",
//         padding: "40px",
//         borderRadius: "12px",
//         boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
//         maxWidth: "500px",
//         width: "100%",
//       }}>
//         <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center", color: "#333" }}>Checkout</h2>
//         <form id="payment-form" onSubmit={handleSubmit}>
//           <PaymentElement id="payment-element" />
//           <button
//             disabled={isProcessing || !stripe || !elements}
//             id="submit"
//             style={{
//               width: "100%",
//               padding: "14px",
//               marginTop: "20px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               color: "#ffffff",
//               backgroundColor: "#007bff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               transition: "background-color 0.3s",
//             }}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
//           >
//             {isProcessing ? "Processing ..." : "Pay now"}
//           </button>
//           {message && (
//             <div
//               id="payment-message"
//               style={{
//                 marginTop: "15px",
//                 padding: "10px",
//                 backgroundColor: "#f8d7da",
//                 color: "#721c24",
//                 borderRadius: "8px",
//                 textAlign: "center",
//                 fontSize: "14px",
//               }}
//             >
//               {message}
//             </div>
//           )}
//         </form>

//         {showOtpPopup && (
//           <div className="otp-popup" style={{
//             marginTop: "20px",
//             padding: "20px",
//             backgroundColor: "#f7f7f7",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//           }}>
//             <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#333" }}>Enter OTP</h3>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 fontSize: "16px",
//                 marginBottom: "10px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//               }}
//             />
//             <button onClick={handleOtpSubmit} style={{
//               width: "100%",
//               padding: "10px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               color: "#ffffff",
//               backgroundColor: "#28a745",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               transition: "background-color 0.3s",
//             }}
//               onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#218838"}
//               onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
//             >
//               Submit OTP
//             </button>
//           </div>
//         )}

//         {/* Loyalty points animation */}
//         {showPointsAnimation && (
//           <div style={{
//             marginTop: "20px",
//             padding: "10px",
//             backgroundColor: "#d4edda",
//             color: "#155724",
//             borderRadius: "8px",
//             textAlign: "center",
//             fontSize: "18px",
//             fontWeight: "bold",
//           }}>
//             <p>Points increasing...</p>
//             <div style={{ fontSize: "30px", fontWeight: "bold" }}>{loyaltyPoints} points</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
