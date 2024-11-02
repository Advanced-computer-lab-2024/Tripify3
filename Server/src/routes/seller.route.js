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
  createProductM,
  searchAllProducts,
  searchMyProducts,
  searchMyProductsArchived,
  searchAllArchivedProducts,
  editProduct,
  searchProduct,
  deleteProduct,
  filterProductCondition,
  sortByRating,
  deleteAllProducts,
  addProdImage,
  viewProductStockAndSales,
  archiveProduct,
  unarchiveProduct,
  decrementProductQuantity,
  getSalesHistory,
  searchaProduct,
  SearchProductById,
} from "../controllers/seller/seller.controller.js";
const router = express.Router();
//search for a seller by username
router.get("/access/seller/getSellerByUserName", getSellerByUserName);

//search for a seller
router.get("/access/seller/findSeller", findSeller);
//search for a seller
router.get("/access/seller/viewSeller", viewSeller);
//signUp as a seller
//update seller
router.put("/access/seller/updateSeller", updateSeller);
//create product
router.post("/access/seller/createProduct", createProduct);
//search all products
router.get("/access/seller/searchAllProducts", searchAllProducts);
//search all products
router.get("/access/seller/searchMyProductsArchived", searchMyProductsArchived);
//search all my products
router.get("/access/seller/searchMyProducts", searchMyProducts);
//search all archived products
router.get(
  "/access/seller/searchAllArchivedProducts",
  searchAllArchivedProducts
);
//edit product
// router.put("/access/seller/editProduct", editProduct);
// search a product
router.get("/access/seller/searchProduct", searchProduct);
//delete a product
router.delete("/access/seller/deleteProduct", deleteProduct);
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
//unarchiveProduct product
router.put("/access/seller/unarchiveProduct", unarchiveProduct);
//update product quantity
router.put("/access/seller/decrementProductQuantity", decrementProductQuantity);
//get sales history
router.get("/access/seller/getSalesHistory", getSalesHistory);
//search for a product
router.get("/access/seller/searchaProduct", searchaProduct);

router.post(
  "/access/seller/createProductM",
  upload.array("images", 5),
  createProductM
);
router.put(
  "/access/seller/editProduct",
  upload.array("images", 5),
  editProduct
);
router.get("/uploads/:sellerId/:filename", getImage);
router.delete("/uploads/:sellerId/:filename", deleteImage);
router.get("/access/seller/SearchProductById", SearchProductById);
export default router;
