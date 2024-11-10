import React from "react";
import TourismGovernorNavbar from "./tourismGovernorNavbar.js";
import TourismGovernorSidebar from "./tourismGovernorSidebar.js"
import { Padding } from "@mui/icons-material";

const TourGuideLayout = ({ children }) => (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
       <TourismGovernorNavbar />
      {/* Fixed sidebar */}
      <TourismGovernorSidebar />
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "90px", backgroundColor: "#f5f5f5" }}>{children}</div>
    </div>
  );

  export default TourGuideLayout; 


  