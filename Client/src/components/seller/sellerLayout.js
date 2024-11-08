// TouristLayout.js
import React from "react";
import { CenterFocusStrong } from "@mui/icons-material";
import SellerNavbar from "./sellerNavbar.js";
import SellerSidebar from "./sellerSidebar.js";

const SellerLayout = ({ children}) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Top Navbar */}
    <SellerNavbar />

    {/* Layout with Sidebar and Main Content */}
    <div style={{ display: "flex", flexGrow: 1, marginTop: "120px" }}> {/* Adjust for Navbar height */}
      {/* Conditionally Render Sidebar */}
      <SellerSidebar />
      
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

export default SellerLayout;
