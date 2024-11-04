import ArchiveProduct from "./archiveProduct.js";
import CreateProductForm from "./CreateProductForm.js"; // Adjust the path if needed
import CreatProdM from "./creatProdM.js"; // Adjust the path if needed
import DecrementProductQuantity from "./DecrementProductQuantity.js";
import DeleteProduct from "./DeleteProduct.js";
import EditProductForm from "./EditProductForm.js";
import Products from "./productSeller.js";
import ProductsA from "./productSellerA.js";
import MyProducts from "./myProducts.js";
import UnarchiveProduct from "./unarchiveProduct.js";
import UpdateSellerForm from "./UpdateSellerForm.js";
import ViewProductStockAndSales from "./ViewProductStockAndSales.js";
import ViewSellerPage from "./viewSeller.js"; // Ensure this path is correct
import FilterSalesReport from "./filterSalesReport.js";
import { useState } from "react";
import EditProduct from "./EditProduct.js";
import WishList from "../tourist/wishList.js";
import Cart from "../tourist/cart2.js";
import ProductNew from "./new/product.js";
import ProductPage2 from "./new/product.js";
import ProductPage from "./new/productPage.js";
import SideBar from "./new/sideBars.js";
const aSeller = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      {/* <ProductNew /> */}
      {/* <ProductPage /> */}
      {/* <SideBar /> */}
      {/* <ProductPage /> */}
      {/* <ViewSellerPage />
      <CreateProductForm />
      <UpdateSellerForm />

      <ViewProductStockAndSales />
      <EditProductForm />*/}
      {toggle ? <Products /> : <ProductsA />}
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      {/* <FilterSalesReport />
      <CreatProdM />
      <EditProduct />
      <WishList />
      <Cart /> */}
    </>
  );
};

export default aSeller;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
