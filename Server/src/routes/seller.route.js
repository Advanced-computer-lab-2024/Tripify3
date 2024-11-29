//https://www.postman.com/supply-technologist-59501949/84b5b4b2-11af-4baa-9cb5-027a8688a59c
import express from "express";
import { upload } from "../middlewares/multer.middleware.js"; // Multer configuration file
import {
  viewSeller,
  updateSeller,
  findSeller,
  getSellerByUserName,
  getImage,
  deleteImage,
} from "../controllers/seller/seller.controller.js";
import {
  createProduct,
  searchAllProducts,
  searchAllArchivedProducts,
  editProduct,
  deleteProduct,
  deleteAllProducts,
  addProdImage,
  viewProductStockAndSales,
  archiveProduct,
  unarchiveProduct,
  getSalesHistory,
  SearchProductById,
  deleteSellerAccount,
  getSellerRevenue
} from "../controllers/seller/seller.controller.js";
const router = express.Router();
//search for a seller by username
router.get("/access/seller/getSellerByUserName", getSellerByUserName);

router.delete("/seller/delete/:id", deleteSellerAccount);

//search for a seller
router.get("/access/seller/find/seller", findSeller);
//search for a seller
router.get("/access/seller/viewSeller", viewSeller);
//signUp as a seller
//update seller
router.put("/seller/profile/:id", updateSeller); // Define the route with :id parameter

//search all products
router.get("/access/seller/searchAllProducts", searchAllProducts);

//search all archived products
router.get(
  "/access/seller/searchAllArchivedProducts",
  searchAllArchivedProducts
);

//delete a product
router.delete("/access/seller/deleteProduct", deleteProduct);
//delete all products
router.delete("/access/seller/deleteAllProducts", deleteAllProducts);
//add product image
router.put("/access/seller/addProdImage", addProdImage);
//view product stock and sales
router.get("/access/seller/viewProductStockAndSales", viewProductStockAndSales);
//archive product
router.put("/access/seller/archiveProduct", archiveProduct);
//unarchiveProduct product
router.put("/access/seller/unarchiveProduct", unarchiveProduct);
//get sales history
router.get("/access/seller/getSalesHistory", getSalesHistory);

router.post(
  "/access/seller/create/product",
  upload.array("images", 5),
  createProduct
);
router.put(
  "/access/seller/editProduct",
  upload.array("images", 5),
  editProduct
);
router.get("/uploads/:sellerId/:filename", getImage);
router.delete("/uploads/:sellerId/:filename", deleteImage);
router.get("/access/seller/SearchProductById", SearchProductById);
router.get('/revenue/:sellerId', getSellerRevenue);

export default router;
