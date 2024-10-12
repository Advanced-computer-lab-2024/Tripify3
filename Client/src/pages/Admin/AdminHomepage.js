
import AddCategory from "./addCategory.js";
import AddTourismGovernForm from "./addTourismGovernorForm.js";
import DeleteCategory from "./deleteCategory.js";
import UpdateCategory from "./updateCategory.js";
import ViewCategory from "./viewCategories.js";
import Products from "../seller/products.js";
import CreateProduct from "../seller/CreateProductForm.js";
import EditProduct from "../seller/EditProductForm.js";
const Admin = () => {
  return (
    <div>
      <AddCategory />
      <AddTourismGovernForm />
      <DeleteCategory />
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
