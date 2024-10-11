import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Auth/Signup.js";
import Login from "./pages/Auth/Login.js";
import PlacesList from "./pages/tourismGovernor/PlacesList.js";
import PlaceDetails from "./pages/tourismGovernor/PlaceDetails.js";
import AddPlace from "./pages/tourismGovernor/AddPlace.js";
import EmailInput from "./pages/Auth/ResetPassword/EmailPage.js";
import VerificationCode from "./pages/Auth/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/Auth/ResetPassword/NewPasswordPage.js";
import TourGuideProfile from "./pages/tourGuide/tourGuideProfile.js";
import Itinerary from "./pages/tourGuide/tourGuideItinerary.js";
import SellerHomepage from "./pages/seller/SellerHomepage.js";
import AdminHomepage from "./pages/admin/AdminHomepage.js";
import AdvertiserProfile from "./pages/advertiser/AdvertiserProfile.js";
import AdvertiserActivities from "./pages/advertiser/AdvertiserActivities.js";
import TouristHomePage from "./pages/tourist/touristHomepage.js";
import ActivitySearchPage from "./pages/tourist/searchActivities.js";
import ProductList from "./pages/seller/ProductList.js";
import ViewSellerprofile from "./pages/seller/viewSellerProfile.js";
import SearchProduct from "./pages/seller/SearchProduct.js";
import FilterProduct from "./pages/seller/FilterProductCondition.js";
import SortBy from "./pages/seller/SortByRating.js";

import Itineraries from "./pages/tourist/itineraries.js";
import HistoricalPlaces from "./pages/tourist/historicalPlaces.js";
import Activities from "./pages/tourist/activities.js";

// Layouts Import
import TouristLayout from "./components/sidebar/tourist/touristLayout.js";
import SellerLayout from "./components/sidebar/seller/sellerLayout.js";
import AdvertiserLayout from "./components/sidebar/advertiser/advertiserLayout.js";
import AdminLayout from "./components/sidebar/admin/adminLayout.js";
import TourGuideLayout from "./components/sidebar/tourGuide/tourGuideLayout.js";
import TourismGovernorLayout from "./components/sidebar/tourismGoverner/tourismGovernorLayout.js";

import { getUserType } from "./utils/authUtils.js";

// Mock function to get the current user role
const getUserRole = () => {
  return getUserType(); // can be "admin", "seller", etc.
};

const App = () => {
  const [userRole, setUserRole] = useState(getUserRole()); // Get user role dynamically

  // Function to return layout based on role
  const getLayoutForRole = (role, children) => {
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
        <Route path="/reset-password/email-input" element={<EmailInput />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Tourism Governor Routes */}
        <Route path={`${basePath}`} element={<PlacesList />} />
        <Route path={`${basePath}/:id`} element={<PlaceDetails />} />
        <Route path={`${basePath}/addPlace`} element={<AddPlace />} />

        {/* Tourist Routes */}
        <Route path={`${basePath}`} element={getLayoutForRole(userRole, <TouristHomePage />)} />

        {/* Shared Routes */}
        <Route path={`${basePath}/activities`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} />
        <Route path={`${basePath}/historical-places`} element={getLayoutForRole(userRole, <HistoricalPlaces />)} />

        {/* Tour Guide Routes */}
        <Route path={`${basePath}/profile`} element={<TourGuideProfile />} />
        <Route path={`${basePath}/tourGuide/itinerary`} element={<Itinerary />} />

        {/* Advertiser Routes */}
        <Route path={`${basePath}/profile`} element={<AdvertiserProfile />} />
        <Route path={`${basePath}/activities`} element={<AdvertiserActivities />} />

        {/* Seller Routes */}
        <Route path={`${basePath}/homepage`} element={<SellerHomepage />} />
        <Route path={`${basePath}/:id`} element={<ViewSellerprofile />} />
        <Route path={`${basePath}/products`} element={<ProductList />} />
        <Route path={`${basePath}/searchProduct`} element={<SearchProduct />} />
        <Route path={`${basePath}/filterProduct`} element={<FilterProduct />} />
        <Route path={`${basePath}/sortBy`} element={<SortBy />} />

        {/* Admin Routes */}
        <Route path={`${basePath}/homepage`} element={<AdminHomepage />} />
      </Routes>
    </Router>
  );
};

export default App;
