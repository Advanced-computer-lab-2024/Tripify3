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
import AddFile from "./addFile";
import axios from "axios";
const ProductEditModal = ({
  open,
  handleClose,
  product,
  setEditProduct,
  newImages,
  //   setNewImages,
  editProduct,
  handleUpdate,
  setNewImage,
}) => {
  if (!product) return null;

  // Center the modal by calculating initial position
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 250,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [filenames, setFilenames] = useState([]);
  const [indicesToRemove, setIndicesToRemove] = useState([]);
  const categories = ["Electronics", "Clothing", "Books", "Beauty", "Sports"]; // Example categories

  // Center the modal when it opens
  useEffect(() => {
    if (open) {
      setPosition({
        x: window.innerWidth / 2 - 250, // Center assuming modal width ~500px
        y: window.innerHeight / 2 - 250, // Center assuming modal height ~500px
      });
    }
  }, [open]);

  // Set the initial position to the center when the modal opens

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleChange = (field, value) => {
    setEditProduct((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, [field]: value } : p))
    );
  };

  //   const handleRemoveImage = (index) => {
  //     setNewImages((prev) => prev.filter((_, i) => i !== index));
  //   };

  const handleDelete = async (index) => {
    setFilenames((prev) => [
      ...prev,
      editProduct[0].imageUrl[index]
        .substring(editProduct[0].imageUrl[index].indexOf("uploads/"))
        .split("/")[2],
    ]);

    setEditProduct((prevEditProduct) => {
      // Since there's only one product, we access it directly
      const product = prevEditProduct[0];

      // Return a new array with the updated product, filtering the imageUrl array
      return [
        {
          ...product,
          imageUrl: product.imageUrl.filter(
            (imgUrl) => imgUrl !== product.imageUrl[index]
          ),
        },
      ];
    });
  };

  const handleDeleteImg = async (files) => {
    // Optimistically remove the images from the UI
    setEditProduct((prev) => {
      const updatedProduct = { ...prev[0] }; // Copy the first product in editProduct
      updatedProduct.imageUrl = updatedProduct.imageUrl.filter(
        (img) => !files.includes(img)
      ); // Filter out the deleted images

      return [updatedProduct]; // Return the updated product in an array
    });

    try {
      // Loop through files and make delete requests
      for (const file of files) {
        await axios.delete(
          `http://localhost:8000/uploads/${editProduct[0].sellerId}/${file}`
        );
      }
    } catch (error) {
      console.error(
        "Error deleting images:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      disableEnforceFocus
    >
      <Paper
        style={{
          position: "absolute",
          top: `${position.y}px`,
          left: `${position.x}px`,
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
        {/* Header with Title and Close Button */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "move",
            bgcolor: "background.paper",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6">Edit {product.name}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={product.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={editProduct[0].price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <TextField
            label="Details"
            fullWidth
            margin="normal"
            value={editProduct[0].details}
            onChange={(e) => handleChange("details", e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={editProduct[0].quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              fullWidth
              margin="normal"
              value={editProduct[0].category}
              onChange={(e) => handleChange("category", e.target.value)}
              displayEmpty
            >
              <MenuItem value={categories[0]}>
                <em>Select a Category</em>
              </MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Images section */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Images
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {editProduct[0].imageUrl &&
              editProduct[0].imageUrl.map((img, index) => (
                <Box key={index} position="relative" width={60} height={60}>
                  <img
                    src={`http://localhost:8000/${img.substring(
                      img.indexOf("uploads/")
                    )}`}
                    alt="product"
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
                    onClick={() => {
                      handleDelete(index);
                      console.log("Filenames:", filenames);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
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
                  onClick={() => {
                    setNewImage((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <AddFile setNewImage={setNewImage} />
          </Box>
        </Box>

        {/* Fixed Save Button */}
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
            onClick={async () => {
              await handleDeleteImg(filenames);
              await handleUpdate(editProduct[0]);
              //   handleDelete();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ProductEditModal;
