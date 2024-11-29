import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddFile from "./addFile"; // Use the actual component here
import axios from "axios";
import { getUserType, getUserId } from "../../../utils/authUtils";
import { Alert } from "@mui/material";

const ProductCreateModal = ({ open, handleClose }) => {
  const categories = ["Electronics", "Clothing", "Books", "Beauty", "Sports"]; // Example categories

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    details: "",
    quantity: "",
    category: "",
    imageUrl: [],
    userId: getUserId(),
    userType: getUserType(),
  });
  const [newImages, setNewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(""); // Clear the error message after 5 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [errorMessage]);

  const handleChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.details ||
      !newProduct.quantity ||
      !newProduct.category ||
      newProduct.category == "_"
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    const newFormData = new FormData();
    newFormData.append("name", newProduct.name);
    newFormData.append("price", newProduct.price);
    newFormData.append("details", newProduct.details);
    newFormData.append("quantity", newProduct.quantity);
    newFormData.append("category", newProduct.category);
    newFormData.append("userId", newProduct.userId);
    newFormData.append("userType", newProduct.userType);

    newImages.forEach((image, index) => {
      newFormData.append(
        "images",
        image,
        `${newProduct.name}-${index + 1}.${image.name.split(".").pop()}`
      );
    });
    console.log("thus is the new form data", newFormData);
    try {
      const response = await axios.post(
        `http://localhost:8000/access/seller/create/product`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleClose();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.response?.data || error.message
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          height: "80vh",
          overflowY: "auto",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6">Create New Product</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <TextField
            label="Details"
            fullWidth
            margin="normal"
            value={newProduct.details}
            onChange={(e) => handleChange("details", e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={newProduct.category || "_"}
              onChange={(e) => handleChange("category", e.target.value)}
              displayEmpty
            >
              <MenuItem value="_">
                <em>Select category</em>
              </MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Images
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {newImages.map((image, index) => (
              <Box key={index} position="relative" width={60} height={60}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="new upload preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <AddFile setNewImage={setNewImages} />
          </Box>
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              {errorMessage}
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            p: 2,
            bgcolor: "background.paper",
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
          >
            Save New Product
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ProductCreateModal;
