import React from "react";
import SellerSidebar from "./sellerSidebar.js";

const SellerLayout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <SellerSidebar />
    <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f5f5f5" }}>
      {children}
    </div>
  </div>
);

export default SellerLayout;
