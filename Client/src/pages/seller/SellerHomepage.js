import ArchiveProduct from "./archiveProduct.js";
import CreateProductForm from "./CreateProductForm.js"; // Adjust the path if needed
import DecrementProductQuantity from "./DecrementProductQuantity.js";
import DeleteProduct from "./DeleteProduct.js";
import EditProductForm from "./EditProductForm.js";
import FilterProductCondition from "./FilterProductCondition.js";
import ProductList from "./ProductList.js";
import MyProduct from "./MyProductList.js";
import SearchProduct from "./SearchMyProduct.js";
import SortByRating from "./SortByRating.js";
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
      <MyProduct />
      <EditProductForm />
      <SearchProduct />
      <FilterProductCondition />
      <SortByRating />

      {/* instead of seller id i want to make it seller username that links ti another tab with the seller info */}
      {/* <DeleteProduct /> 
      <ViewProductStockAndSales />
      <ArchiveProduct />
      <UnarchiveProduct />
      <DecrementProductQuantity />
      <FilterSalesReport />
      */}
    </>
  );
};

export default aSeller;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
