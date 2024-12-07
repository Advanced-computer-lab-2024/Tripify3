import React from "react";
import TouristNavbar from "./touristNavbar.js";
import { useLocation } from "react-router-dom";
import { useMatch } from "react-router-dom";



const TouristLayout = ({ children }) => {
  const location = useLocation();

  // Check if the current route is '/chatbot'
  const isChatbotRoute = location.pathname === "/chatbot";
  const isSelectAddressRoute = useMatch("/tourist/select/address/:price/:type/:dropOffDate");
  const isPaymentRoute = useMatch("/tourist/payment/:price/:type/:itemId/:tickets/:dropOffLocation/:dropOffDate");
  
   // Determine margin for main content based on current route
   const topMargin = isChatbotRoute || isSelectAddressRoute || isPaymentRoute ? "60px" : "140px";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Top Navbar */}
      <TouristNavbar />

      {/* Layout with Sidebar and Main Content */}
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          marginTop: topMargin // Adjust for Navbar height conditionally
        }}
      >
        {/* Scrollable Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f5f5f5",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TouristLayout;
