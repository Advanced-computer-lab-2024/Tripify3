import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FollowedTourGuides from "./pages/tourist/followedtourguides.js";
import Signup from "./pages/Auth/Signup.js";
import Login from "./pages/Auth/Login.js";
import AddPlace from "./pages/tourismGovernor/AddPlace.js";
import Placedetails from "./pages/tourist/placedetails.js";
import ChangePassword from "./pages/tourist/change-password.js";
import ActivityDetails from "./pages/tourist/activitydetails.js"; // Create this Component
import EmailInput from "./pages/Auth/ResetPassword/EmailPage.js";
import VerificationCode from "./pages/Auth/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/Auth/ResetPassword/NewPasswordPage.js";
import ProductsLists from "./pages/seller/productsList.js";
import AdvertiserProfile from "./pages/advertiser/profile.js";
import AdvertiserActivities from "./pages/advertiser/activities.js";
import TouristHomePage from "./pages/tourist/homepage.js";
import TouristProfile from "./pages/tourist/profile.js"
import SearchFlights from "./pages/tourist/searchFlights.js";
import LoadFlights from "./pages/tourist/loadFlights.js";
import SearchHotels from "./pages/tourist/searchHotels.js";
import ComplaintForm from "./pages/tourist/complaintForm.js";
import ViewComplaints from "./pages/tourist/viewComplaints.js";
import PaymentWrapper from "./pages/tourist/payment.js";
import Transportation from "./pages/tourist/transportation.js";
import GovernorHistoricalPlaceDetails from "./pages/tourismGovernor/placeDetails.js";

import Itineraries from "./pages/tourist/itineraries.js";
import HistoricalPlaces from "./pages/tourist/historicalPlaces.js";
import Activities from "./pages/tourist/activities.js";

import Categories from "./pages/admin/categories.js";
import ItinerariesDetails from "./pages/tourist/itinerarydetails.js";
import TourGuideActivities from "./pages/advertiser/activities.js";
import TourGuideItineraryDetails from "./pages/tourGuide/tourGuideItineraryDetails.js";


import GovernorHistoricalPlaces from "./pages/tourismGovernor/historicalPlaces.js";
import GovernorTags from "./pages/tourismGovernor/tags.js";

import ToursmGovernorProfile from "./pages/tourismGovernor/profile.js";
import FileViewer from "./pages/admin/fileViewer.js";
import Complaints from "./pages/admin/complaints.js";

import TourGuideItinerary from "./pages/tourGuide/tourGuideItineraries.js";
import TourGuideProfile from "./pages/tourGuide/profile.js";
//import ActivateDeactivateItinerary from "./pages/tourGuide/activateDeactivateItinerary.js";
import BookingDetails from "./pages/tourist/bookingDetails.js";

import TermsAndAgreements from "./pages/Auth/TermsAndAgreements.js";

// Layouts Import
import TouristLayout from "./components/tourist/touristLayout.js";
import SellerLayout from "./components/seller/sellerLayout.js";
import AdvertiserLayout from "./components/advertiser/advertiserLayout.js";
import AdminLayout from "./components/admin/adminLayout.js";
import TourGuideLayout from "./components/tourGuide/tourGuideLayout.js";
import TourismGovernorLayout from "./components/tourismGoverner/tourismGovernorLayout.js";
import Goodbye from "./components/goodbye.js";

import { getUserType } from "./utils/authUtils.js";
import Chatbot from "./pages/AI/chatbot.js";
import Users from "./pages/admin/users.js";
import Tags from "./pages/admin/tags.js";
import LoadHotels from "./pages/tourist/loadHotels.js";
import ProductPage from "./pages/seller/new/productPage.js";
import Bookings from "./pages/tourist/bookings.js";
import SellerProfile from "./pages/seller/profile.js";
// Mock function to get the current user role
const getUserRole = () => {
  return getUserType(); // can be "admin", "seller", etc.
};

const App = () => {
  const [userRole, setUserRole] = useState(getUserRole()); // Get user role dynamically

  // Function to return layout based on role
  const getLayoutForRole = (role, children) => {
    console.log(role);

    switch (role) {
      case "Tourist":
        return <TouristLayout>{children}</TouristLayout>;
      case "Seller":
        return <SellerLayout>{children}</SellerLayout>;
      case "Admin":
        return <AdminLayout>{children}</AdminLayout>;
      case "Advertiser":
        return <AdvertiserLayout>{children}</AdvertiserLayout>;
      case "Tour Guide":
        return <TourGuideLayout>{children}</TourGuideLayout>;
      case "Tourism Governor":
        return <TourismGovernorLayout>{children}</TourismGovernorLayout>;
      default:
        return children; // Default layout if no specific role
    }
  };

  // Base path based on user role
  const basePath =
    userRole === "Tourism Governor"
      ? "/tourism-governor"
      : userRole === "Tourist"
      ? "/tourist"
      : userRole === "Seller"
      ? "/seller"
      : userRole === "Admin"
      ? "/admin"
      : userRole === "Advertiser"
      ? "/advertiser"
      : userRole === "Tour Guide"
      ? "/tour-guide"
      : "";

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-input" element={<EmailInput />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/termsAndAgreements" element={<TermsAndAgreements />} />
        <Route path="/goodbye" element={<Goodbye />} />

        
        {/* Tourism Governor Routes */}
         <Route path={`/tourism-governor/historical-places/details/:id`} element={getLayoutForRole(userRole, <GovernorHistoricalPlaceDetails />)} />
        <Route path={`${basePath}/addPlace`} element={<AddPlace />} />
        <Route path={`/tourism-governor/profile`} element={getLayoutForRole(userRole, <ToursmGovernorProfile />)} />
        <Route path={`/tourism-governor/tags`} element={getLayoutForRole(userRole, <GovernorTags />)} />


        {/* Tourist Routes */}
        <Route path={`/tourist`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`/tourist/homepage`} element={getLayoutForRole(userRole, <TouristHomePage />)} />
        <Route path={`/tourist/profile`} element={getLayoutForRole(userRole, <TouristProfile />)} />
        <Route path={"/search_flights"} element={getLayoutForRole(userRole, <SearchFlights />)} />
        <Route path={"/load_flights"} element={getLayoutForRole(userRole, <LoadFlights />)} />
        <Route path={"/search_hotels"} element={getLayoutForRole(userRole, <SearchHotels />)} />
        <Route path={"/load_hotels"} element={getLayoutForRole(userRole, <LoadHotels />)} />
        <Route path={"/transportation"} element={getLayoutForRole(userRole, < Transportation/>)} />

        <Route path={"/tourist/payment"} element={<PaymentWrapper />} />
        <Route path={"/tourist/view/complaints"} element={getLayoutForRole(userRole, <ViewComplaints />)} />
        <Route path={"/tourist/itinerary/:id"} element={getLayoutForRole(userRole, <ItinerariesDetails />)} />
        <Route path={"/tourist/bookings"} element={getLayoutForRole(userRole, <Bookings />)} />
        {/* Add the BookingDetails route with dynamic id and type parameters */}
        <Route path="/tourist/booking-details/:itemId/:type/:view/:bookingId" element={getLayoutForRole(userRole, <BookingDetails />)} />


        {/* Shared Routes */}
        <Route path={`/activity/:id`} element={getLayoutForRole(userRole, <ActivityDetails />)} /> {/* Correct usage */}
        {/* <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} /> */}

        <Route path={`/place/:id`} element={getLayoutForRole(userRole, <Placedetails />)} />
        <Route path={`${basePath}/activities`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} />
        <Route path={`${basePath}/pasttourguides/:id`} element={getLayoutForRole(userRole, <FollowedTourGuides />)} />
        <Route path={`${basePath}/file-complaint`} element={getLayoutForRole(userRole, <ComplaintForm />)} />
        <Route path={`${basePath}/change-password`} element={getLayoutForRole(userRole, <ChangePassword />)} />
        <Route path={`${basePath}/historical-places`} element={getLayoutForRole(userRole, <HistoricalPlaces />)} />
        <Route path={`${basePath}/products`} element={getLayoutForRole(userRole, <ProductsLists />)} />


        {/* Tour Guide Routes */}
        {/* <Route path={`/tour-guide/activate-deactivate/itinerary/`} element={<TourGuideActivateDeactivateItinerary />} /> */}
        <Route path={`/tour-guide/itinerary`} element={getLayoutForRole(userRole, <TourGuideItinerary />)} />
        <Route path={`/tour-guide/itinerary/details/:id`} element={getLayoutForRole(userRole, <TourGuideItineraryDetails />)} />
        <Route path={`/tour-guide/profile`} element={getLayoutForRole(userRole, <TourGuideProfile />)} />
        <Route path={`/tour-guide/activities`} element={getLayoutForRole(userRole, <TourGuideActivities />)} />


        {/* Advertiser Routes */}
        <Route path={`/advertiser/profile`} element={getLayoutForRole(userRole, <AdvertiserProfile />)} />
        <Route path={`/advertiser/my-activities`} element={getLayoutForRole(userRole, <AdvertiserActivities />)}  />


        {/* Seller Routes */}
        <Route path={`${basePath}/homepage`} element={getLayoutForRole(userRole, <ProductsLists />)} />
        <Route path={`${basePath}/profile`}  element={getLayoutForRole(userRole, <SellerProfile />)} />
        <Route path={"product/:productId"} element={<ProductPage />} />


        {/* Admin Routes */}
        <Route path={"/chatbot"} element={getLayoutForRole(userRole, <Chatbot />)} />
        <Route path={`/admin/users`} element={getLayoutForRole(userRole, <Users />)} />
        <Route path={`${basePath}/categories`} element={getLayoutForRole(userRole, <Categories />)} />
        <Route path={`${basePath}/tags`} element={getLayoutForRole(userRole, <Tags />)} />
        <Route path={`${basePath}/file-viewer`} element={getLayoutForRole(userRole, <FileViewer />)} />
        <Route path={`${basePath}/complaints`} element={getLayoutForRole(userRole, <Complaints />)} />

      </Routes>
    </Router>
  );
};

export default App;
