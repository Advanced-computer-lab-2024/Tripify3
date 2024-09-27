import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import Header from "./components/Header.js";
import LoginPage from "./pages/LoginPage.js"; // Ensure this path is correct


const App = () => {
  return (
    <Router> {/* This sets up the routing system */}
      <Header /> {/* The Header component will appear on all pages */}
      <Routes>  {/* This wraps all the routes for different pages */}
        <Route path="/" element={<HomePage />} />  {/* Defines a route for the home page */}
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
      
    </Router>
  );
};

export default App;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components