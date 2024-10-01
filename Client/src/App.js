import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import SignupPage from "./pages/SignupPage.js";
import Header from "./components/Header.js";
import LoginPage from "./pages/LoginPage.js"; // Ensure this path is correct
import ViewSellerPage from "./seller/viewSeller.js"; // Ensure this path is correct
import CreateProductForm from "./seller/CreateProductForm.js"; // Adjust the path if needed
import UpdateSellerForm from "./seller/UpdateSellerForm";
import ProductList from "./seller/ProductList.js";
import EditProductForm from "./seller/EditProductForm.js";
import SearchProduct from "./seller/SearchProduct.js";
import DeleteProduct from "./seller/DeleteProduct.js";
import FilterProductCondition from "./seller/FilterProductCondition.js";
import SortByRating from "./seller/SortByRating.js";
import AddProdImage from "./seller/AddProdImage.js";
import ViewProductStockAndSales from "./seller/ViewProductStockAndSales.js";
import ArchiveProduct from "./seller/archiveProduct.js";
import DecrementProductQuantity from "./seller/DecrementProductQuantity.js";
import FilterSalesReport from "./seller/filterSalesReport.js";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <ViewSellerPage />
      <CreateProductForm />
      <UpdateSellerForm />
      <ProductList />
      <EditProductForm />
      <SearchProduct />
      <DeleteProduct />
      <FilterProductCondition />
      <SortByRating />
      <AddProdImage />
      <ViewProductStockAndSales />
      <ArchiveProduct />
      <DecrementProductQuantity />
      <FilterSalesReport />
    </Router>
  );
};

export default App;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
