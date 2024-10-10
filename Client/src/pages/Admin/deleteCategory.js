import React, { useState } from "react";
import axios from "axios";

const DeleteCategoryForm = () => {
  const [categoryName, setCategoryName] = useState(""); // Category name to be deleted
  const [responseMessage, setResponseMessage] = useState(""); // Response message

  // Handle form submission for deleting category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the delete request
      const response = await axios.delete(
        "http://localhost:8000/admin/deleteCategory",
        {
          data: { name: categoryName },
        }
      );

      setResponseMessage(`Category deleted: ${response.data.name}`);

      setTimeout(() => {
        window.location.reload(); 
      }, 1000);

    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error deleting category."
      );
    }
  };

  return (
    <div>
      <h2>Delete Category</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <button type="submit">Delete Category</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default DeleteCategoryForm;
