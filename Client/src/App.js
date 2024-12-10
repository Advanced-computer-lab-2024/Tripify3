import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FollowedTourGuides from "./pages/tourist/followedtourguides.js";
import Signup from "./pages/Auth/Signup.js";
import Login from "./pages/Auth/Login.js";
import PlaceDetails from "./pages/tourist/placedetails.js";
import ChangePassword from "./pages/tourist/change-password.js";
import ActivityDetails from "./pages/tourist/activitydetails.js"; // Create this Component
import EmailInput from "./pages/Auth/ResetPassword/EmailPage.js";
import VerificationCode from "./pages/Auth/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/Auth/ResetPassword/NewPasswordPage.js";
import ProductsLists from "./pages/seller/productsList.js";
import AdvertiserProfile from "./pages/advertiser/profile.js";
import AdvertiserActivities from "./pages/advertiser/advertiserActivities.js";
import TouristHomePage from "./pages/tourist/homepage.js";
import TouristProfile from "./pages/tourist/profile.js";
import SearchFlights from "./pages/tourist/searchFlights.js";
import LoadFlights from "./pages/tourist/loadFlights.js";
import SearchHotels from "./pages/tourist/searchHotels.js";
import ComplaintForm from "./pages/tourist/complaintForm.js";
import ViewComplaints from "./pages/tourist/viewComplaints.js";
import Transportation from "./pages/tourist/transportation.js";
import AdvertiserAddActivity from "./pages/advertiser/advertiserAddActivity.js";
import OrdersPage from "./pages/tourist/orders.js";
import AddAddress from "./pages/tourist/addAddress.js";
import SelectAddress from "./pages/tourist/selectAddress.js";
import PaymentSuccess from "./pages/tourist/paymentSuccess.js";
import Bookmarks from "./pages/tourist/bookmarkedEvents.js";
import ProductsReport from "./pages/admin/productsReport.js";

import Itineraries from "./pages/tourist/itineraries.js";
import HistoricalPlaces from "./pages/tourist/historicalPlaces.js";
import Activities from "./pages/tourist/activities.js";
import SalesReport from "./pages/seller/salesReport.js"
import Categories from "./pages/admin/categories.js";
import ItinerariesDetails from "./pages/tourist/itinerarydetails.js";
import TourGuideActivities from "./pages/advertiser/advertiserActivities.js";
import TourGuideItineraryDetails from "./pages/tourGuide/tourGuideItineraryDetails.js";
import TourGuideCreateItinerary from "./pages/tourGuide/createItinerary.js";
import TourGuideEditItinerary from "./pages/tourGuide/tourGuideEditItinerary.js";
import TourGuideSalesReport from "./pages/tourGuide/tourGuideSalesReport.js"
import TourismGovernorEditPlace from "./pages/tourismGovernor/tourismGovernorEditPlace.js";
import GovernorTags from "./pages/tourismGovernor/tags.js";
import AdvertiserSalesReport from "./pages/advertiser/advertiserSalesReport.js";
import ToursmGovernorProfile from "./pages/tourismGovernor/profile.js";
import FileViewer from "./pages/admin/fileViewer.js";
import Complaints from "./pages/admin/complaints.js";
import SaleReport from "./pages/admin/saleReport.js"
import TourGuideItinerary from "./pages/tourGuide/tourGuideItineraries.js";
import TourGuideProfile from "./pages/tourGuide/profile.js";
import BookingDetails from "./pages/tourist/bookingDetails.js";
import TermsAndAgreements from "./pages/Auth/TermsAndAgreements.js";
import AdvertiserActivityDetails from "./pages/advertiser/AdvertiserActivityDetails.js";
import AdminProfile from "./pages/admin/profile.js";
import TourismGovernorAddPlace from "./pages/tourismGovernor/tourismGovernorAddPlace.js";

// Layouts Import
import TouristLayout from "./components/tourist/touristLayout.js";
import SellerLayout from "./components/seller/sellerLayout.js";
import AdvertiserLayout from "./components/advertiser/advertiserLayout.js";
import AdminLayout from "./components/admin/adminLayout.js";
import TourGuideLayout from "./components/tourGuide/tourGuideLayout.js";
import TourismGovernorLayout from "./components/tourismGoverner/tourismGovernorLayout.js";
import GuestLayout from "./components/guest/guestLayout.js";
import Goodbye from "./components/goodbye.js";

import { getUserType } from "./utils/authUtils.js";
import Chatbot from "./pages/AI/chatbot.js";
import Users from "./pages/admin/users.js";
import Tags from "./pages/admin/tags.js";
import LoadHotels from "./pages/tourist/loadHotels.js";
import ProductPage from "./pages/seller/new/productPage.js";
import Bookings from "./pages/tourist/bookings.js";
import SellerProfile from "./pages/seller/profile.js";
import Cart from "./pages/tourist/cart2.js";
import WishList from "./pages/tourist/wishList.js";
import Payment from "./pages/tourist/payment/payment.js";
import Completion from "./pages/tourist/payment/completion.js";
import GuestHistoricalPlaces from "./pages/guest/historicalPlaces.js";
import GuestPlaceDetails from "./pages/guest/placeDetails.js";
import GuestActivities from "./pages/guest/activities.js";
import GuestItineraries from "./pages/guest/itineraries.js";
import GuestActivityDetails from "./pages/guest/activitydetails.js";
import UserData from "./pages/admin/userData.js"
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
      case "Guest":
        return <GuestLayout>{children}</GuestLayout>;
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
        {/* Guest Routes */}
        <Route path={`/guest/historical-places`} element={getLayoutForRole(userRole, <GuestHistoricalPlaces />)} />
        <Route path={`/guest/historical-places/:id`} element={getLayoutForRole(userRole, <GuestPlaceDetails />)} />
        <Route path={`/guest/itineraries`} element={getLayoutForRole(userRole, <GuestItineraries />)} />
        <Route path={`/guest/activities`} element={getLayoutForRole(userRole, <GuestActivities />)} />
        <Route path={`/guest/activity/:id`} element={getLayoutForRole(userRole, <GuestActivityDetails />)} />

        {/* Tourism Governor Routes */}
        <Route path={`/tourism-governor/historical-places/edit/:id`} element={getLayoutForRole(userRole, <TourismGovernorEditPlace />)} />
        <Route path={`/tourism-governor/profile`} element={getLayoutForRole(userRole, <ToursmGovernorProfile />)} />
        <Route path={`/tourism-governor/tags`} element={getLayoutForRole(userRole, <GovernorTags />)} />
        <Route path={`/tourism-governor/historical-places/add`} element={getLayoutForRole(userRole, <TourismGovernorAddPlace />)} />
        {/* Tourist Routes */}
        <Route path={`/tourist`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`/tourist/homepage`} element={getLayoutForRole(userRole, <TouristHomePage />)} />
        <Route path={`/tourist/profile`} element={getLayoutForRole(userRole, <TouristProfile />)} />
        <Route path={"/search_flights"} element={getLayoutForRole(userRole, <SearchFlights />)} />
        <Route path={"/load_flights"} element={getLayoutForRole(userRole, <LoadFlights />)} />
        <Route path={"/search_hotels"} element={getLayoutForRole(userRole, <SearchHotels />)} />
        <Route path={"/load_hotels"} element={getLayoutForRole(userRole, <LoadHotels />)} />
        <Route path={"/transportation"} element={getLayoutForRole(userRole, <Transportation />)} />
        <Route path={"/tourist/my-orders"} element={getLayoutForRole(userRole, <OrdersPage />)} />
        <Route path={"/tourist/payment/:price/:type/:itemId/:tickets/:dropOffLocation/:dropOffDate/:delivery/:details"} element={getLayoutForRole(userRole, <Payment />)} />
        <Route path={"/tourist/completionn"} element={getLayoutForRole(userRole, <Completion />)} />
        <Route path={"/tourist/view/complaints"} element={getLayoutForRole(userRole, <ViewComplaints />)} />
        <Route path={"/tourist/itinerary/:id"} element={getLayoutForRole(userRole, <ItinerariesDetails />)} />
        <Route path={"/tourist/bookings"} element={getLayoutForRole(userRole, <Bookings />)} />
        <Route path={"/tourist/mycart"} element={getLayoutForRole(userRole, <Cart />)} />
        <Route path={"/tourist/wishlist"} element={getLayoutForRole(userRole, <WishList />)} />
        <Route path={"/tourist/payment/success"} element={getLayoutForRole(userRole, <PaymentSuccess />)} />
        <Route path={"/tourist/bookmark/events"} element={getLayoutForRole(userRole, <Bookmarks />)} />
        {/* Add the BookingDetails route with dynamic id and type parameters */}
        <Route path="/tourist/booking-details/:itemId/:type/:view/:bookingId" element={getLayoutForRole(userRole, <BookingDetails />)} />
        {/* Shared Routes */}
        <Route path={`/activity/:id`} element={getLayoutForRole(userRole, <ActivityDetails />)} /> {/* Correct usage */}
        {/* <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} /> */}
        <Route path={`/historical-places/:id`} element={getLayoutForRole(userRole, <PlaceDetails />)} />
        <Route path={`${basePath}/activities`} element={getLayoutForRole(userRole, <Activities />)} />
        <Route path={`${basePath}/itineraries`} element={getLayoutForRole(userRole, <Itineraries />)} />
        <Route path={`${basePath}/pasttourguides/:id`} element={getLayoutForRole(userRole, <FollowedTourGuides />)} />
        <Route path={`${basePath}/file-complaint`} element={getLayoutForRole(userRole, <ComplaintForm />)} />
        <Route path={`${basePath}/change-password`} element={getLayoutForRole(userRole, <ChangePassword />)} />
        <Route path={`${basePath}/historical-places`} element={getLayoutForRole(userRole, <HistoricalPlaces />)} />
        <Route path={`${basePath}/products`} element={getLayoutForRole(userRole, <ProductsLists />)} />
        <Route path={`${basePath}/add/address`} element={getLayoutForRole(userRole, <AddAddress />)}  />
        <Route path={`${basePath}/select/address/:price/:type/:dropOffDate/:delivery`} element={getLayoutForRole(userRole, <SelectAddress />)}  />

        {/* Tour Guide Routes */}
        {/* <Route path={`/tour-guide/activate-deactivate/itinerary/`} element={<TourGuideActivateDeactivateItinerary />} /> */}
        <Route path={`/tour-guide/itinerary`} element={getLayoutForRole(userRole, <TourGuideItinerary />)} />
        
        <Route path={`/tour-guide/salesReport`} element={getLayoutForRole(userRole, <TourGuideSalesReport />)} />
        <Route path={`/advertiser/salesReport`} element={getLayoutForRole(userRole, <AdvertiserSalesReport />)} />
        
        <Route path={`/seller/salesReport`} element={getLayoutForRole(userRole, <SalesReport />)} />

        <Route path={`/tour-guide/itinerary/details/:id`} element={getLayoutForRole(userRole, <TourGuideItineraryDetails />)} />
        <Route path={`/tour-guide/itinerary/edit/:id`} element={getLayoutForRole(userRole, <TourGuideEditItinerary />)} />
        <Route path={`/tour-guide/create-itinerary`} element={getLayoutForRole(userRole, <TourGuideCreateItinerary />)} />
        <Route path={`/tour-guide/profile`} element={getLayoutForRole(userRole, <TourGuideProfile />)} />
        <Route path={`/tour-guide/activities`} element={getLayoutForRole(userRole, <TourGuideActivities />)} />
        {/* Advertiser Routes */}
        <Route path={`/advertiser/profile`} element={getLayoutForRole(userRole, <AdvertiserProfile />)} />
        <Route path={`/advertiser/my-activities`} element={getLayoutForRole(userRole, <AdvertiserActivities />)} />
        <Route path={`/advertiser/my-activities/details/:id`} element={getLayoutForRole(userRole, <AdvertiserActivityDetails />)} />
        <Route path={`/advertiser/my-activities/add`} element={getLayoutForRole(userRole, <AdvertiserAddActivity />)} />
        {/* Seller Routes */}
        <Route path={`/seller/my-products`} element={getLayoutForRole(userRole, <ProductsLists />)} />
        <Route path={`/seller/profile`} element={getLayoutForRole(userRole, <SellerProfile />)} />
        <Route path={"product/:productId"} element={getLayoutForRole(userRole, <ProductPage />)} />
        {/* Admin Routes */}
        <Route path={"/chatbot"} element={getLayoutForRole(userRole, <Chatbot />)} />
        <Route path={`/admin/users`} element={getLayoutForRole(userRole, <Users />)} />
        <Route path={`/admin/profile`} element={getLayoutForRole(userRole, <AdminProfile />)} />
        <Route path={`/admin/products/report`} element={getLayoutForRole(userRole, < ProductsReport/>)} />
        <Route path={`${basePath}/categories`} element={getLayoutForRole(userRole, <Categories />)} />
        <Route path={`${basePath}/tags`} element={getLayoutForRole(userRole, <Tags />)} />
        <Route path={`${basePath}/file-viewer`} element={getLayoutForRole(userRole, <FileViewer />)} />
        <Route path={`${basePath}/complaints`} element={getLayoutForRole(userRole, <Complaints />)} />
        <Route path={`${basePath}/saleReport`} element={getLayoutForRole(userRole, <SaleReport />)} />
        <Route path={`/admin/userData`} element={getLayoutForRole(userRole, <UserData />)} />

      </Routes>
    </Router>
  );
};

export default App;
