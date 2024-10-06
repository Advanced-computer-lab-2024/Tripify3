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
import TourGuideProfile from "./pages/TourGuide/TourGuideProfile.js";
import Itinerary from "./pages/TourGuide/TourGuideItinerary.js";
import EditPlace from "./pages/TourGuide/TourGuideProfile.js";
import SellerHomepage from "./pages/seller/SellerHomepage.js";
import AdminHomepage from "./pages/admin/AdminHomepage.js";
import AdvertiserProfile from "./pages/advertiser/AdvertiserProfile.js";
import AdvertiserActivities from "./pages/advertiser/AdvertiserActivities.js";
import TouristHomePage from "./pages/tourist/TouristHomepage.js";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/governor" element={<PlacesList />} />
        <Route path="/governor/:id" element={<PlaceDetails />} />
        <Route path="/governor/addPlace" element={<AddPlace />} />
        <Route path="/governor/edit/:id" element={<EditPlace />} />
        <Route path="/username-input" element={<EmailInput />} />
        <Route path="/tourist/homepage" element={<TouristHomePage />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/tourGuide/profile" element={<TourGuideProfile />} />
        <Route path="/advertiser/profile" element={<AdvertiserProfile />} />
        <Route path="/advertiser/activities" element={<AdvertiserActivities />} />
        <Route path="/seller/homepage" element={<SellerHomepage />} />
        <Route path="/admin/homepage" element={<AdminHomepage />} />
        {/* <Route path="/tourist/homepage" element={<TouristHomepage />} /> */}
        <Route path="/tourGuide/Itinerary" element={<Itinerary />} />
      </Routes>
    </Router>
  );
};

export default App;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
