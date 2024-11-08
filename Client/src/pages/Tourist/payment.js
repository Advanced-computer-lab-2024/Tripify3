// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// import axios from "axios";
// import React from "react";
// import { Card, Typography, Space } from 'antd';
// const { Title } = Typography

// function PaymentPage() {
//   const [itineraryData, setItineraryData] = useState(null);
//   const [activityData, setActivityData] = useState(null);
//   const [price, setPrice] = useState('');
//   const [type, setType] = useState(null);
//   const [email, setEmail] = useState("");
//   const [amount, setAmount] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const amountInCents = price * 100
//     try {
//       const response = await fetch("http://localhost:8000/payment/pay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: amountInCents, currency: "usd", email }),
//       });
//       const data = await response.json();
//       console.log(data);
//       if (data.clientSecret) {
//         // Store email and clientSecret in localStorage
//         localStorage.setItem("paymentEmail", email);
//         localStorage.setItem("clientSecret", data.clientSecret);

//         // Redirect to checkout page
//         navigate("/checkout");
//       } else {
//         message.error("Error creating payment. Please try again.");
//       }
//     } catch (error) {
//       console.error("Payment initiation failed:", error);
//       message.error("Error initiating payment. Please try again.");
//     }
//   };

//   const handleDisplayBooked = async () => {
//     try {
//       const userJson = localStorage.getItem('user');
//       if (!userJson) {
//         message.error("User is not logged in.");
//         return null;
//       }
//       const user = JSON.parse(userJson);
//       if (!user || !user.username) {
//         message.error("User information is missing.");
//         return null;
//       }

//       const itineraryOrActivity = localStorage.getItem('type');
//       const activityId = localStorage.getItem('activityId');
//       const itineraryId = localStorage.getItem('itineraryId');

//       if (!itineraryOrActivity) {
//         message.error("Type information is missing.");
//         return null;
//       }

//       setType(itineraryOrActivity);

//       let response;

//       if (itineraryOrActivity === 'itinerary' && itineraryId) {
//         response = await axios.get(`http://localhost:8000/touristRoutes/viewDesiredItinerary/${itineraryId}`);
//         if (response.status === 200) {
//           setItineraryData(response.data);
//           setPrice(response.data.price);
//         } else {
//           message.error("Failed to retrieve itinerary details.");
//         }
//       }
//       else if (itineraryOrActivity === 'activity' && activityId) {
//         console.log("Fetching activity data for ID:", activityId); // Debugging
//         response = await axios.get(`http://localhost:8000/touristRoutes/viewDesiredActivity/${activityId}`);
//         if (response.status === 200) {
//           console.log("Activity data fetched:", response.data); // Debugging
//           setActivityData(response.data);
//           setPrice(response.data.price);
//         } else {
//           message.error("Failed to retrieve activity details.");
//         }
//       } else {
//         message.error("Failed to retrieve details");
//       }
//       //console.log(response);
//     } catch (error) {
//       console.error("Error:", error);
//       message.error("An error occurred while retrieving the booking.");
//     }
//   };

//   useEffect(() => {
//     handleDisplayBooked();
//   }, [type]);


//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       maxWidth: '300px',
//       margin: 'auto',
//       gap: '1rem',
//       overflowY: 'visible',
//       height: '120vh'
//     }}>

//       <div>
//         {itineraryData || activityData ? (
//           <Card style={{ maxWidth: '600px', margin: '20px auto', borderRadius: '8px' }}>
//             <Title level={3}>Booked Details</Title>
//             {type === 'itinerary' ? (
//               <div>
//                 <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
//                   <p><strong>Itinerary Details:</strong> {itineraryData.name}</p>
//                   <p><strong>Locations:</strong> {itineraryData.locations.join(', ')}</p>
//                   <p><strong>Timeline:</strong> {itineraryData.timeline}</p>
//                   <p><strong>Language:</strong> {itineraryData.language}</p>
//                   <p><strong>Price:</strong> {itineraryData.price}</p>
//                   <p><strong>Available Dates and Times:</strong> {itineraryData.availableDatesAndTimes.length > 0
//                     ? itineraryData.availableDatesAndTimes.map((dateTime, index) => {
//                       const dateObj = new Date(dateTime);
//                       const date = dateObj.toISOString().split('T')[0];
//                       const time = dateObj.toTimeString().split(' ')[0];
//                       return (
//                         <div key={index}>
//                           Date {index + 1}: {date}<br />
//                           Time {index + 1}: {time}
//                         </div>
//                       );
//                     })
//                     : 'No available dates and times'}</p>
//                   <p><strong>Accessibility:</strong> {itineraryData.accessibility}</p>
//                   <p><strong>Pick Up Location:</strong> {itineraryData.pickUpLocation}</p>
//                   <p><strong>Drop Off Location:</strong> {itineraryData.dropOffLocation}</p>
//                   <p><strong>Rating:</strong> {itineraryData.rating}</p>
//                   <p><strong>Tags:</strong> {itineraryData.tags}</p>
//                 </Space>
//               </div>
//             ) : type === 'activity' && activityData ? (
//               <div>
//                 <p><strong>Activity Name:</strong> {activityData.name}</p>
//                 <p><strong>Price:</strong> {activityData.price}</p>
//                 <p><strong>Is Open:</strong> {activityData.location}</p>
//                 <p><strong>Category:</strong> {activityData.category}</p>
//                 <p><strong>Tags:</strong> {activityData.tags}</p>
//                 <p><strong>Special Discount:</strong> {activityData.specialDiscount}</p>
//                 <p><strong>Date and Time:</strong> {activityData.date
//                   ? (() => {
//                     const dateObj = new Date(activityData.date);
//                     const date = dateObj.toISOString().split('T')[0];
//                     const time = dateObj.toTimeString().split(' ')[0];
//                     return (
//                       <div>
//                         {date} at {time}
//                       </div>
//                     );
//                   })()
//                   : 'No available date and time'}</p>
//                 <p><strong>Duration:</strong> {activityData.duration}</p>
//                 <p><strong>Location:</strong> {activityData.location}</p>
//                 <p><strong>Ratings:</strong> {activityData.averageRating}</p>
//               </div>
//             ) : null}
//           </Card>
//         ) : (
//           <p>Loading booking details...</p>
//         )}
//       </div>

//       <h1>Enter Payment Details</h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ padding: '8px', fontSize: '1rem' }}
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={price}
//           onChange={(e) => setAmount(e.target.value * 100)}
//           required
//           readOnly
//           style={{ padding: '8px', fontSize: '1rem', marginTop: '8px' }}
//         />
//         <button type="submit" style={{ padding: '10px', fontSize: '1rem', marginTop: '12px' }}>Submit</button>
//       </form>
//     </div>

//   );
// }

// export default PaymentPage;