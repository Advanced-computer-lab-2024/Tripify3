import AddAdmin from "./addAdmin";
import AddCategory from "./addCategory";
import AddTag from "./addTag";
import AddTourismGovernForm from "./AddTourismGovernForm";
import DeleteCategory from "./deleteCategory";
import DeleteTag from "./deleteTag";
import DeleteUserForm from "./DeleteUserForm";
import UpdateCategory from "./updateCategory";
import UpdateTag from "./updateTag";
import ViewCategory from "./viewCategory";
import ViewTag from "./viewTag";
import ProductList from "../seller/ProductList";
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
    </div>
  );
};

export default Admin;
