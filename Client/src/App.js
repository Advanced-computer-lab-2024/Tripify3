import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FollowedTourGuides from "./pages/tourist/followedtourguides.js";
import Signup from "./pages/Auth/Signup.js";
import Login from "./pages/Auth/Login.js";
import PlacesList from "./pages/tourismGovernor/PlacesList.js";
import AddPlace from "./pages/tourismGovernor/AddPlace.js";

import ActivityDetails from './pages/tourist/activitydetails.js'; // Create this Component
import EmailInput from "./pages/Auth/ResetPassword/EmailPage.js";
import VerificationCode from "./pages/Auth/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/Auth/ResetPassword/NewPasswordPage.js";
import SellerHomepage from "./pages/seller/SellerHomepage.js";
import AdvertiserProfile from "./pages/advertiser/AdvertiserProfile.js";
import AdvertiserActivities from "./pages/advertiser/AdvertiserActivities.js";
import TouristHomePage from "./pages/tourist/homepage.js";
import TouristProfile from "./pages/tourist/profile.js";
import SearchFlights from "./pages/tourist/searchFlights.js";
import LoadFlights from "./pages/tourist/loadFlights.js";
import ViewSellerprofile from "./pages/seller/viewSellerProfile.js";
import MyProducts from "./pages/seller/myProducts.js";
import ComplaintForm from "./pages/tourist/complaintForm.js";
import ViewComplaints from "./pages/tourist/viewComplaints.js";

import Itineraries from "./pages/tourist/itineraries.js";
import HistoricalPlaces from "./pages/tourist/historicalPlaces.js";
import Activities from "./pages/tourist/activities.js";
import Products from "./pages/seller/products.js";
import Categories from "./pages/admin/categories.js";

import GovernorHistoricalPlaces from "./pages/tourismGovernor/historicalPlaces.js"
import GovernorTags from "./pages/tourismGovernor/tags.js"

import ToursmGovernorProfile from "./pages/tourismGovernor/profile.js";
import FileViewer from "./pages/admin/fileViewer.js";
import Complaints from "./pages/admin/complaints.js";

import TourGuideItinerary from "./pages/tourGuide/itinerary.js";
import TourGuideProfile from "./pages/tourGuide/profile.js";
//import ActivateDeactivateItinerary from "./pages/tourGuide/activateDeactivateItinerary.js";

// Layouts Import
import TouristLayout from "./components/tourist/touristLayout.js";
import SellerLayout from "./components/seller/sellerLayout.js";
import AdvertiserLayout from "./components/advertiser/advertiserLayout.js";
import AdminLayout from "./components/admin/adminLayout.js";
import TourGuideLayout from "./components/tourGuide/tourGuideLayout.js";
import TourismGovernorLayout from "./components/tourismGoverner/tourismGovernorLayout.js";

import { getUserType } from "./utils/authUtils.js";
import Chatbot from "./pages/AI/chatbot.js";
import Users from "./pages/admin/users.js";
import Tags from "./pages/admin/tags.js";

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

        {/* Tourism Governor Routes */}
        <Route path={`/tourism-governor`} element={getLayoutForRole(userRole, <PlacesList />)} />
        <Route path={`/tourism-governor/historical-places`}  element={getLayoutForRole(userRole, <GovernorHistoricalPlaces />)}  />
        <Route path={`${basePath}/addPlace`} element={<AddPlace />} />
          <Route path={`/tourism-governor/profile`} element={getLayoutForRole(userRole, <ToursmGovernorProfile />)} />
          <Route path={`/tourism-governor/tags`} element={getLayoutForRole(userRole, <GovernorTags />)} />


        {/* Tourist Routes */}
        <Route path={`/tourist`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`/tourist/homepage`} element={getLayoutForRole(userRole, <TouristHomePage />)} />
        <Route path={`/tourist/profile`} element={getLayoutForRole(userRole, <TouristProfile />)} />
        <Route path={"/search/flights"} element={<SearchFlights />} />
        <Route path={"/load/flights"} element={<LoadFlights />} />
        <Route path={"/tourist/view/complaints/:id"} element={<ViewComplaints />} />

      

        {/* Shared Routes */}
        <Route path={`${basePath}/activities`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`${basePath}/activity/:id`} element={getLayoutForRole(userRole, <ActivityDetails />)} /> {/* Correct usage */}
        <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} />
        <Route path={`${basePath}/file-complaint`} element={getLayoutForRole(userRole, <ComplaintForm />)} />
        <Route path={`${basePath}/historical-places`} element={getLayoutForRole(userRole, <HistoricalPlaces />)} />
        <Route path={`${basePath}/products`} element={getLayoutForRole(userRole, <Products />)} />

        {/* Tour Guide Routes */}
        {/* <Route path={`/tour-guide/activate-deactivate/itinerary/`} element={<TourGuideActivateDeactivateItinerary />} /> */}
        <Route path={`/tour-guide/itinerary`} element={getLayoutForRole(userRole, <TourGuideItinerary />)} />
        <Route path={`/tour-guide/profile`} element={getLayoutForRole(userRole, <TourGuideProfile />)} />

        {/* Advertiser Routes */}
        <Route path={`${basePath}/advertiser`} element={<AdvertiserProfile />} />
        <Route path={`${basePath}/activities`} element={<AdvertiserActivities />} />

        {/* Seller Routes */}
        <Route path={`${basePath}/seller`} element={getLayoutForRole(userRole, <SellerHomepage />)} />
        <Route path={`${basePath}/my-products`} element={getLayoutForRole(userRole, <MyProducts />)} />
        <Route path={`${basePath}/:id`} element={<ViewSellerprofile />} />

        {/* Admin Routes */}
        <Route path={"/chatbot"} element={getLayoutForRole(userRole, <Chatbot />)} />
        <Route path={`${basePath}/users`} element={getLayoutForRole(userRole, <Users />)} />
        <Route path={`${basePath}/categories`} element={getLayoutForRole(userRole, <Categories />)} />
        <Route path={`${basePath}/tags`} element={getLayoutForRole(userRole, <Tags />)} />
        <Route path={`${basePath}/file-viewer`} element={getLayoutForRole(userRole, <FileViewer />)} />
        <Route path={`${basePath}/complaints`} element={getLayoutForRole(userRole, <Complaints />)} />
      </Routes>
    </Router>
  );
};

export default App;
