import ArchiveProduct from "./archiveProduct.js";
import CreateProductForm from "./CreateProductForm.js"; // Adjust the path if needed
import DecrementProductQuantity from "./DecrementProductQuantity.js";
import DeleteProduct from "./DeleteProduct.js";
import EditProductForm from "./EditProductForm.js";
import Products from "./productSeller.js";
import MyProducts from "./myProducts.js";
import UnarchiveProduct from "./unarchiveProduct.js";
import UpdateSellerForm from "./UpdateSellerForm.js";
import ViewProductStockAndSales from "./ViewProductStockAndSales.js";
import ViewSellerPage from "./viewSeller.js"; // Ensure this path is correct
import FilterSalesReport from "./filterSalesReport.js";

const aSeller = () => {
  return (
    <>
      <ViewSellerPage />
      <CreateProductForm />
      <UpdateSellerForm />
      {/* <ProductList /> */}
      <MyProducts />
      <EditProductForm />
      <Products />
      <FilterSalesReport />
    </>
  );
};

export default aSeller;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
