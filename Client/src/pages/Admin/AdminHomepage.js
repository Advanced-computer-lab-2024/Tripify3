import AddAdmin from "./addAdmin.js";
import AddCategory from "./addCategory.js";
import AddTag from "./addTag.js";
import AddTourismGovernForm from "./addTourismGovernorForm.js";
import DeleteCategory from "./deleteCategory.js";
import DeleteTag from "./deleteTag.js";
import DeleteUserForm from "./DeleteUserForm.js";
import UpdateCategory from "./updateCategory.js";
import UpdateTag from "./updateTag.js";
import ViewCategory from "./viewCategories.js";
import ViewTag from "./viewTags.js";
import ProductList from "../seller/ProductList.js";
import SearchProduct from "../seller/SearchProduct.js";
import FilterProduct from "../seller/FilterProductCondition.js";
import SortBy from "../seller/SortByRating.js";
import CreateProduct from "../seller/CreateProductForm.js";
import EditProduct from "../seller/EditProductForm.js";
const Admin = () => {
  return (
    <div>
      <AddAdmin />
      <AddCategory />
      <AddTag />
      <AddTourismGovernForm />
      <DeleteCategory />
      <DeleteTag />
      <DeleteUserForm />
      <UpdateCategory />
      <UpdateTag />
      <ViewCategory />
      <ViewTag />
      <ProductList />
      <SearchProduct />
      <FilterProduct />
      <SortBy />
      <CreateProduct />
      <EditProduct />
    </div>
  );
};

export default Admin;
