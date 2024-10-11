import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Auth/SignupPage.js";
import Navbar from "./components/Navbar.js";
import LoginPage from "./pages/Auth/LoginPage.js"; // Ensure this path is correct
import PlacesList from "./pages/tourismGovernor/PlacesList.js"; // Ensure this path is correct
import PlaceDetails from "./pages/tourismGovernor/PlaceDetails.js"; // Ensure this path is correct
import AddPlace from "./pages/tourismGovernor/AddPlace.js"; // Ensure this path is correct
import EmailInput from "./pages/Auth/ResetPassword/EmailPage.js";
import VerificationCode from "./pages/Auth/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/Auth/ResetPassword/NewPasswordPage.js";
import TourGuideProfile from "./pages/tourGuide/tourGuideProfile.js";
import Itinerary from "./pages/tourGuide/tourGuideItinerary.js";
import EditPlacTourismGovernor from "./pages/tourismGovernor/EditPlace.js";
import SellerHomepage from "./pages/seller/SellerHomepage.js";
import AdminHomepage from "./pages/admin/AdminHomepage.js";
import AdvertiserProfile from "./pages/advertiser/AdvertiserProfile.js";
import AdvertiserActivities from "./pages/advertiser/AdvertiserActivities.js";
import TouristHomePage from "./pages/tourist/touristHomepage.js";
// import DoctorInformation from "./pages/advertiser/addLocation.js";
import AllItineraries from "./pages/tourist/allItineraries.js";
import AllHistoricalPlaces from "./pages/tourist/allHistoricalPlaces.js";
import ActivitySearchPage from "./pages/tourist/searchActivities.js";
import PlaceSearchPage from "./pages/tourist/searchPlaces.js";
import ProductList from "./pages/seller/ProductList.js";
import ViewSellerprofile from "./pages/seller/viewSellerProfile.js";
import SearchProduct from "./pages/seller/SearchProduct.js";
import FilterProduct from "./pages/seller/FilterProductCondition.js";
import SortBy from "./pages/seller/SortByRating.js";
import AllActivities from "./pages/tourist/allActivites.js";
import SearchItineraries from "./pages/tourist/searchItineraries.js";
import TouristSidebar from "./components/sidebar/touristsidebar.js";


const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor: "#f8f9fa", borderRight: "1px solid #ccc", height: "100vh" }}>
          <Routes>
            <Route path="/tourist/*" element={<TouristSidebar />} />
            {/* Add other sidebars like SellerSidebar, AdminSidebar, etc., here */}
          </Routes>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/governor" element={<PlacesList />} />
            <Route path="/governor/:id" element={<PlaceDetails />} />
            <Route path="/governor/addPlace" element={<AddPlace />} />
            <Route path="/governor/edit/:id" element={<EditPlacTourismGovernor />} />
            <Route path="/username-input" element={<EmailInput />} />
            <Route path="/tourist" element={<TouristHomePage />} />
            <Route path="/tourist/activities" element={<AllActivities />} />
            <Route path="/tourist/itineraries" element={<AllItineraries />} />
            <Route path="/tourist/historicalplaces" element={<AllHistoricalPlaces />} />
            <Route path="/verify-code" element={<VerificationCode />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/tourGuide/profile" element={<TourGuideProfile />} />
            <Route path="/advertiser/profile" element={<AdvertiserProfile />} />
            <Route path="/advertiser/activities" element={<AdvertiserActivities />} />
            <Route path="/seller/homepage" element={<SellerHomepage />} />
            <Route path="/admin/homepage" element={<AdminHomepage />} />
            <Route path="/tourGuide/itinerary" element={<Itinerary />} />
            <Route path="/search/activities/" element={<ActivitySearchPage />} />
            <Route path="/search/places/" element={<PlaceSearchPage />} />
            <Route path="/search/itinerary" element={<SearchItineraries />} />
            <Route path="/tourist/ProductList" element={<ProductList />} />
            <Route path="/tourist/searchProduct" element={<SearchProduct />} />
            <Route path="/tourist/FilterProduct" element={<FilterProduct />} />
            <Route path="/tourist/SortBy" element={<SortBy />} />
            <Route path="/seller/:id" element={<ViewSellerprofile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};


export default App;