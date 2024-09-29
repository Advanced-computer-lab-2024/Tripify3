import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import SignupPage from "./pages/SignupPage.js";
import Header from "./components/Header.js";
import LoginPage from "./pages/LoginPage.js"; // Ensure this path is correct
import UsernameInput from "./pages/ResetPassword/UsernamePage.js";
import VerificationCode from "./pages/ResetPassword/VerificationCodePage.js";
import NewPassword from "./pages/ResetPassword/NewPasswordPage.js";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/username-input" element={<UsernameInput />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
