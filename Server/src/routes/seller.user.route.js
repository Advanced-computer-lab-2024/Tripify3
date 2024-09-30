//https://www.postman.com/supply-technologist-59501949/84b5b4b2-11af-4baa-9cb5-027a8688a59c
import express from "express";
import {
  getSellers,
  viewSeller,
  signup,
  updateSeller,
} from "../controllers/seller.user.controller.js";
import {
  createProduct,
  searchAllProducts,
  editProduct,
  searchProduct,
  deleteProduct,
  filterProduct,
  filterProductCondition,
  sortByRating,
  deleteAllProducts,
  addProdImage,
  viewProductStockAndSales,
  archiveProduct,
  decrementProductQuantity,
  filterSalesReport,
} from "../controllers/seller.user.controller.js";
const router = express.Router();
//view all sellers
router.get("/access/seller/getSellers", getSellers);
//search for a seller
router.get("/access/seller/viewSeller", viewSeller);
//signUp as a seller
router.post("/access/seller/signup", signup); //validation and login
//update seller
router.put("/access/seller/updateSeller", updateSeller);
//create product
router.post("/access/seller/createProduct", createProduct);
//search all products
router.get("/access/seller/searchAllProducts", searchAllProducts);
//edit product
router.put("/access/seller/editProduct", editProduct);
//search a product
router.get("/access/seller/searchProduct", searchProduct);
//delete a product
router.delete("/access/seller/deleteProduct", deleteProduct);
//filter product
router.get("/access/seller/filterProduct", filterProduct);
//filter product by condition
router.get("/access/seller/filterProductCondition", filterProductCondition);
//sort product by rating
router.get("/access/seller/sortByRating", sortByRating);
//delete all products
router.delete("/access/seller/deleteAllProducts", deleteAllProducts);
//add product image
router.put("/access/seller/addProdImage", addProdImage);
//view product stock and sales
router.get("/access/seller/viewProductStockAndSales", viewProductStockAndSales);
//archive product
router.put("/access/seller/archiveProduct", archiveProduct);
//update product quantity
router.put("/access/seller/decrementProductQuantity", decrementProductQuantity);
//filter sales report
router.get("/access/seller/filterSalesReport", filterSalesReport);

export default router;
