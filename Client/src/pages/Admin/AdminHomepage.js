
import AddTourismGovernForm from "./addTourismGovernorForm.js";
import UpdateCategory from "./updateCategory.js";
import ViewCategory from "./viewCategories.js";
import Products from "../seller/products.js";
import CreateProduct from "../seller/CreateProductForm.js";
import EditProduct from "../seller/EditProductForm.js";
const Admin = () => {
  return (
    <div>
      <AddTourismGovernForm />
      <UpdateCategory />
      <ViewCategory />
      <Products />
      <SortBy />
      <CreateProduct />
      <EditProduct />
    </div>
  );
};

export default Admin;
