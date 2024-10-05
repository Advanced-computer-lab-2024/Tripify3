import React, { useState } from "react";
import axios from "axios";

const EditProductForm = () => {
  const [name, setName] = useState(""); // Product name (to search)
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState([]); // Array to store fetched images
  const [category, setCategory] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [productId, setProductId] = useState(""); // Store productId

  // Fetch product details and images based on the product name
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/searchProduct?name=${name}`
      );
      const product = response.data[0]; // Assuming response is an array

      // Set product details and images
      setProductId(product._id);
      setPrice(product.price);
      setDetails(product.details);
      setQuantity(product.quantity);
      setCategory(product.category);
      setSellerId(product.sellerId);
      setImageUrl(product.imageUrl || []); // Assuming imageUrl is part of product details
      console.log("Product details:");
    } catch (error) {
      setProductId("");
      setPrice("");
      setDetails("");
      setQuantity("");
      setCategory("");
      setSellerId("");
      setImageUrl([]);
      console.error("Error fetching product details:", error);
      setResponseMessage(error.response?.data?.message || "Product not found.");
    }
  };

  // Update the image URLs directly
  const handleImageChange = (index, value) => {
    const updatedImages = [...imageUrl];
    updatedImages[index] = value; // Update the image URL at the specific index
    setImageUrl(updatedImages);
  };

  // Handle form submission for updating the product
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(imageUrl);
    try {
      // Make the API request to edit the product
      const response = await axios.put(
        "http://localhost:8000/access/seller/editProduct",
        {
          name,
          price,
          details,
          quantity,
          category,
          sellerId,
          imageUrl, // Send the updated image URLs
        }
      );
      // Set response message on success
      setResponseMessage("Product updated successfully.");
      console.log("Response:", response.data);
    } catch (error) {
      // Handle any errors
      set;
      console.error("Error:", error.response?.data || error.message); // Log the backend error message
      setResponseMessage("Failed to update product.");
    }
  };

  // Add a new empty image input field
  const handleAddNewImage = () => {
    setImageUrl([...imageUrl, ""]);
  };

  return (
    <div>
      <h2>Edit Product</h2>

      {/* Product Name Input */}
      <div>
        <label>Product Name (to search): </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
        />
        <button type="button" onClick={fetchProduct}>
          Fetch Product
        </button>
      </div>

      {/* Display fetched product details after fetching */}
      {productId && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Price: </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label>Details: </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter product details"
            />
          </div>

          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label>Category: </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <label>Seller ID: </label>
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="Enter seller ID"
              readOnly
            />
          </div>

          {/* Display existing images as editable text inputs */}
          <div>
            <h4>Product Images</h4>
            {imageUrl.length > 0 ? (
              imageUrl.map((url, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = imageUrl.filter(
                        (_, i) => i !== index
                      );
                      console.log(imageUrl);
                      setImageUrl(updatedImages);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No images available for this product.</p>
            )}

            {/* Button to add a new image field */}
            <button type="button" onClick={handleAddNewImage}>
              Add New Image
            </button>
          </div>

          <button type="submit">Update Product</button>
        </form>
      )}

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default EditProductForm;
