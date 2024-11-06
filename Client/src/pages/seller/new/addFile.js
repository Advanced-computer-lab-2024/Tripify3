import React, { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ProductImageUpload = ({ setNewImage }) => {
  const fileInputRef = useRef(null);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setNewImage((prevImages) => [...prevImages, ...files]);
  };

  return (
    <div>
      {/* Add Button to open file selector */}
      <IconButton onClick={handleAddClick} color="primary">
        <AddIcon />
      </IconButton>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProductImageUpload;
