import React from "react";
import SellerNavbar from "./sellerNavbar.js";
import SellerSidebar from "./sellerSidebar.js"
import { Padding } from "@mui/icons-material";

const TourGuideLayout = ({ children }) => (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
       <SellerNavbar />
      {/* Fixed sidebar */}
      <SellerSidebar />
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "90px", backgroundColor: "#f5f5f5" }}>{children}</div>
    </div>
  );

  export default TourGuideLayout; 


  