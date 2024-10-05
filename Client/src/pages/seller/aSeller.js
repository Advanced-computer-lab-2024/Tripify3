import ArchiveProduct from "./archiveProduct.js";
import CreateProductForm from "./CreateProductForm.js"; // Adjust the path if needed
import DecrementProductQuantity from "./DecrementProductQuantity.js";
import DeleteProduct from "./DeleteProduct.js";
import EditProductForm from "./EditProductForm.js";
import FilterProductCondition from "./FilterProductCondition.js";
import ProductList from "./ProductList.js";
import SearchProduct from "./SearchProduct.js";
import SortByRating from "./SortByRating.js";
import UnarchiveProduct from "./unarchiveProduct.js";
import UpdateSellerForm from "./UpdateSellerForm";
import ViewProductStockAndSales from "./ViewProductStockAndSales.js";
import ViewSellerPage from "./viewSeller.js"; // Ensure this path is correct
import FilterSalesReport from "./filterSalesReport.js";

const aSeller = () => {
  return (
    <>
      <FilterSalesReport />
      <ViewSellerPage />
      <CreateProductForm />
      <UpdateSellerForm />
      <ProductList />
      <EditProductForm />
      <SearchProduct />
      <DeleteProduct />
      <FilterProductCondition />
      <SortByRating />
      <ViewProductStockAndSales />
      <ArchiveProduct />
      <UnarchiveProduct />
      <DecrementProductQuantity />
    </>
  );
};

export default aSeller;
//App.js is the main component of your application where you define the structure of your app, including pages, routes, and other components
