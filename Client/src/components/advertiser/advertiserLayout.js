import React from "react";
import AdvertiserSidebar from "./advertiserSidebar.js";

const AdvertiserLayout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <AdvertiserSidebar />
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f5f5f5" }}>
      {children}
    </div>
  </div>
);

export default AdvertiserLayout;
