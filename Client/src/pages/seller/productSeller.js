import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserType, getUserId } from "../../utils/authUtils";
import { IconButton } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive"; // Import an archive icon
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import AddFile from "./new/addFile";
import ProductEditModal from "./new/modal";
import ProductCreateModal from "./new/modalCreate";

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CircularProgress,
  Box,
  Button,
  Chip,
  Checkbox,
  OutlinedInput,
  ListItemText,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const ImageFlipper = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Adjust currentImageIndex if it goes out of bounds after images update
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(images.length - 1);
    }
  }, [images, currentImageIndex]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Left Button */}
      <IconButton
        style={{
          position: "absolute",
          left: 10,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
        onClick={handlePrevImage}
      >
        <ArrowBack />
      </IconButton>

      {/* Display Current Image */}
      <CardMedia
        component="img"
        image={`http://localhost:8000/${images[currentImageIndex]?.substring(
          images[currentImageIndex].indexOf("uploads/")
        )}`}
        alt="Product image"
        style={{
          objectFit: "cover",
          borderRadius: "8px",
          minWidth: "200px",
          minHeight: "200px",
          maxWidth: "200px",
          maxHeight: "200px",
          margin: "auto",
          marginTop: "15px",
        }}
      />

      {/* Right Button */}
      <IconButton
        style={{
          position: "absolute",
          right: 10,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
        onClick={handleNextImage}
      >
        <ArrowForward />
      </IconButton>
    </div>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f",
      contrastText: "#ffffff", // Ensures readable text on primary background
    },
    secondary: {
      main: "#ff6f00",
      contrastText: "#ffffff", // Ensures readable text on secondary background
    },
    background: {
      default: "#f5f5f5", // Light gray background for the app
      paper: "#ffffff", // White background for cards
    },
    text: {
      primary: "#333333", // Dark gray text for readability
      secondary: "#666666", // Lighter gray for secondary text
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    h4: {
      fontWeight: 700, // Bold for headings
      fontSize: "1.8rem",
      color: "#1e3a5f",
    },
    body1: {
      fontSize: "1rem",
      color: "#333333",
    },
    button: {
      fontWeight: 600, // Makes buttons more prominent
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#1e3a5f",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)", // Increased shadow on hover
          },
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Default shadow for cards
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none", // Disables uppercase text for readability
          padding: "8px 16px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1e3a5f",
            },
            "&:hover fieldset": {
              borderColor: "#ff6f00", // Secondary color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff6f00", // Secondary color when focused
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#1e3a5f", // Primary color for icons
          "&:hover": {
            backgroundColor: "rgba(30, 58, 95, 0.08)", // Light primary color on hover
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1e3a5f", // Primary color for tooltip
          color: "#ffffff",
          fontSize: "0.9rem",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Soft shadow for dialogs and menus
        },
      },
    },
  },
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sellerNames, setSellerNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterOption, setFilterOption] = useState({ rating: 0 });
  const [budget, setBudget] = useState(""); // State for budget
  const [effect, setEffect] = useState("");
  const [wishArray, setWishArray] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/access/seller/searchAllProducts"
      );
      if (getUserType() === "Seller") {
        setProducts(
          response.data.filter((product) => product.sellerId === getUserId())
        );
      } else {
        setProducts(response.data);
      }
      fetchSellerNames(response.data);
    } catch (error) {
      setErrorMessage("Error fetching products: " + error.message);
    }
  };

  const fetchSellerNames = async (products) => {
    try {
      const sellerIds = [
        ...new Set(products.map((product) => product.sellerId)),
      ];
      const sellerPromises = sellerIds.map((sellerId) =>
        axios.get(
          `http://localhost:8000/access/seller/findSeller?id=${sellerId}`
        )
      );
      const sellerResponses = await Promise.all(sellerPromises);
      const sellerData = sellerResponses.reduce((acc, response) => {
        const { _id, name } = response.data;
        acc[_id] = name;
        return acc;
      }, {});
      setSellerNames(sellerData);
    } catch (error) {
      setErrorMessage("Error fetching seller names: " + error.message);
    }
  };
  const fetchWishList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tourist/wishlist/get?touristId=${getUserId()}`
      );
      setWishArray(response.data.items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      alert("Failed to fetch the wishlist. ");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [effect, wishArray]);
  useEffect(() => {
    if (getUserType() === "Tourist") fetchWishList();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.rating >= filterOption.rating &&
        product.price <= (budget || Infinity) // Filter by budget
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder("");
    setFilterOption({ rating: 0 });
    setBudget(""); // Reset budget
  };
  const handleArchive = async (productId) => {
    try {
      // API call with `id` in the request body
      const response = await axios.put(
        "http://localhost:8000/access/seller/archiveProduct",
        { id: productId } // Sending the product id in the request body
      );
      alert("Product archived successfully");
      setEffect(response.data);
    } catch (error) {
      console.error("Error archiving product:", error);
      alert("Failed to archive the product. ");
    }
  };
  const handleWishlist = async (productId) => {
    try {
      // API call with `id` in the request body
      if (!wishArray.includes(productId)) {
        const response = await axios.put(
          "http://localhost:8000/tourist/wishlist/Add",
          { id: productId, touristId: getUserId() } // Sending the product id in the request body
        );
        setWishArray((prevWishArray) => [...prevWishArray, productId]);
      } else {
        const response = await axios.put(
          "http://localhost:8000/tourist/wishlist/remove",
          { id: productId, touristId: getUserId() } // Sending the product id in the request body
        );
        setWishArray((prevWishArray) =>
          prevWishArray.filter((id) => id !== productId)
        );
      }
    } catch (error) {
      console.error("Error archiving product:", error);
      // alert("Failed to add to wishList. ");
    }
  };

  const handleUpdate = async (product) => {
    try {
      console.log("Updating product", product);
      const response = await axios.put(
        `http://localhost:8000/access/seller/editProduct3?productId=${product._id}`, // Don't pass the productId in the URL
        product, // Pass the product object in the request body
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": getUserId(), // Pass userId in the headers
          },
        }
      );
      fetchProducts();
      console.log("Product updated successfully", response.data);
    } catch (error) {
      console.error(
        "Error updating product",
        error.response?.data || error.message
      );
    }
  };

  const handleAdd2 = async (product) => {
    // Prepare the form data
    const newFormData = new FormData();
    newFormData.append("productId", product._id); // Include productId in the request body
    newFormData.append("name", product.name);
    newFormData.append("price", product.price);
    newFormData.append("details", product.details);
    newFormData.append("quantity", product.quantity);
    newFormData.append("category", product.category);
    newFormData.append("sellerId", product.sellerId);

    // Append existing images as URLs
    product.imageUrl.forEach((url) => {
      newFormData.append("existingImages", url); // Assuming your backend handles "existingImages" for URLs
    });

    // Append new images (files uploaded by the user)
    // Append new images (files uploaded by the user)
    newImage.forEach((image, index) => {
      newFormData.append(
        "images", // Ensure this field name matches with multer's expected field
        image,
        `${product.name}-${index + product.imageUrl.length + 1}.${image.name
          .split(".")
          .pop()}`
      );
    });

    // Debug: Log the FormData content to verify its structure

    try {
      // Send the PUT request with the form data to update the product
      const response = await axios.put(
        `http://localhost:8000/access/seller/editProduct`, // Don't pass the productId in the URL
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": getUserId(), // Pass userId in the headers
          },
        }
      );

      console.log("Product updated successfully", response.data);

      // Optionally, update the UI or reset states here if needed
      // Example: refresh product data or clear form states
      setNewImage([]);
    } catch (error) {
      console.error(
        "Error updating product",
        error.response?.data || error.message
      );
    }
    fetchProducts();
  };

  const handleAdd = async (product) => {
    const newFormData = new FormData();
    newFormData.append("productId", product._id);
    newFormData.append("name", product.name);
    newFormData.append("price", product.price);
    newFormData.append("details", product.details);
    newFormData.append("quantity", product.quantity);
    newFormData.append("category", product.category);
    newFormData.append("sellerId", product.sellerId);

    product.imageUrl.forEach((url) => {
      newFormData.append("existingImages", url);
    });

    // Extract all current indices from existing image URLs
    const currentIndices = product.imageUrl
      .map((url) => {
        const match = url.match(/-(\d+)\./);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((index) => index !== null)
      .sort((a, b) => a - b);

    // Identify gaps (missing indices) in the current indices
    const missingIndices = [];
    for (let i = 1; i <= Math.max(...currentIndices); i++) {
      if (!currentIndices.includes(i)) {
        missingIndices.push(i);
      }
    }

    // Start index for new images from the next highest number
    let nextIndex = Math.max(...currentIndices, 0) + 1;

    // Append new images using missing indices first, then increment
    newImage.forEach((image, idx) => {
      console.log("this is image", image);
      const useIndex =
        missingIndices.length > 0 ? missingIndices.shift() : nextIndex++;
      newFormData.append(
        "images",
        image,
        `${product.name}-${useIndex}.${image.name.split(".").pop()}`
      );
    });

    try {
      const response = await axios.put(
        `http://localhost:8000/access/seller/editProduct`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": getUserId(),
          },
        }
      );

      console.log("Product updated successfully", response.data);
      setNewImage([]);
    } catch (error) {
      console.error(
        "Error updating product",
        error.response?.data || error.message
      );
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    handleEdits(product);
    setSelectedProduct(product); // Set the selected product for the modal
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditProduct([]);
    setNewImage([]);
    setSelectedProduct(null);
    fetchProducts();
  };
  const handleCloseModal2 = () => {
    console.log("thisis cvlosdffdg");
    setOpenCreate(false);
    fetchProducts();
  };

  const handleEdits = (product) => {
    setEditProduct((prev) => {
      const productExists = prev.find((p) => p._id === product._id);
      if (productExists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, { ...product }];
      }
    });
    console.log("this is the image", newImage);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Product List
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          {/* <Typography variant="h3" align="center" color="primary" gutterBottom>
            Products
          </Typography> */}

          {/* Search Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <TextField
              label="Search Products"
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mr: 2, width: "300px" }}
            />
            <FormControl variant="outlined" sx={{ mr: 2, width: "150px" }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort by Price"
              >
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Budget"
              variant="outlined"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              sx={{ mr: 2, width: "150px" }}
            />
            <Button variant="contained" onClick={() => setSortOrder(sortOrder)}>
              Sort
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={resetFilters}
              sx={{ ml: 2 }}
            >
              Reset Filters
            </Button>
          </Box>

          {/* Filter Section */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
              <InputLabel>Filter by Rating</InputLabel>
              <Select
                value={filterOption.rating}
                onChange={(e) => setFilterOption({ rating: e.target.value })}
              >
                <MenuItem value={0}>All Ratings</MenuItem>
                <MenuItem value={1}>1 Star</MenuItem>
                <MenuItem value={2}>2 Stars</MenuItem>
                <MenuItem value={3}>3 Stars</MenuItem>
                <MenuItem value={4}>4 Stars</MenuItem>
                <MenuItem value={5}>5 Stars</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card style={{ position: "relative" }}>
                      {/* Archive Button in Top Right */}
                      {getUserType() !== "Tourist" ? (
                        <>
                          {!editProduct.some((p) => p._id === product._id) ? (
                            <IconButton
                              style={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                zIndex: 1,
                                backgroundColor: "#fff",
                              }}
                              onClick={() => handleArchive(product._id)} // Function to handle archiving
                            >
                              <ArchiveIcon />
                            </IconButton>
                          ) : (
                            <Box
                              style={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                zIndex: 1,
                                backgroundColor: "#fff",
                              }}
                            >
                              <AddFile setNewImage={setNewImage} />
                            </Box>
                          )}
                          <IconButton
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              zIndex: 1,
                              backgroundColor: "#fff",
                            }}
                            onClick={() => {
                              handleEdit(product);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: "#fff",
                          }}
                          onClick={() => handleWishlist(product._id)}
                        >
                          {wishArray.includes(product._id) ? (
                            <FavoriteIcon style={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      )}
                      <Link
                        to={`/product/${product._id}`} // Link to the product page
                        style={{ textDecoration: "none", color: "inherit" }} // Ensures link doesn't affect card styling
                      >
                        {Array.isArray(product.imageUrl) &&
                        product.imageUrl.length > 0 ? (
                          <ImageFlipper images={product.imageUrl} />
                        ) : (
                          <CircularProgress
                            style={{
                              margin: "auto",
                              display: "block",
                            }}
                            size={50}
                          />
                        )}
                        <CardContent>
                          <Typography variant="h5">{product.name}</Typography>
                          <Typography>Price: ${product.price}</Typography>
                          <Typography>Details: {product.details}</Typography>
                          <Rating
                            name="read-only"
                            value={product.rating}
                            readOnly
                          />
                          <Typography>Quantity: {product.quantity}</Typography>
                          <Typography>Category: {product.category}</Typography>
                          <Typography>Sales: {product.sales}</Typography>

                          {product.reviews && product.reviews.length > 0 ? (
                            <div>
                              <Typography variant="h6">
                                Sales History
                              </Typography>
                              <ul>
                                {product.reviews.map((review, index) => (
                                  <li key={index}>
                                    Review ID: {review._id}, Rating:{" "}
                                    {review.rating}, {review.comment}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <Typography>
                              No reviews, be the first one to give feedback.
                            </Typography>
                          )}

                          <Typography>
                            Seller:{" "}
                            {sellerNames[product.sellerId] ? (
                              <Link to={`/seller/${product.sellerId}`}>
                                {sellerNames[product.sellerId]}
                              </Link>
                            ) : (
                              "Loading seller name..."
                            )}
                          </Typography>
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Set a fixed height if desired
                      backgroundColor: "#f0f0f0", // Light gray background
                      cursor: "pointer",
                    }}
                    onClick={() => console.log("Open modal or perform action")}
                  >
                    <IconButton
                      onClick={() => {
                        setOpenCreate(true);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%", // Set a fixed height if desired
                    backgroundColor: "#f0f0f0", // Light gray background
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Open modal or perform action")}
                >
                  {getUserType() == "Seller" || getUserType() == "Admin" ? (
                    <IconButton
                      onClick={() => {
                        setOpenCreate(true);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </Card>
              </Grid>
            )}
          </div>
        </Box>
      </div>
      <ProductEditModal
        open={openModal}
        handleClose={handleCloseModal}
        product={selectedProduct}
        setEditProduct={setEditProduct}
        newImages={newImage}
        setNewImages={setNewImage}
        editProduct={editProduct}
        handleUpdate={handleAdd}
        setNewImage={setNewImage}
      />
      {openCreate && (
        <ProductCreateModal open={openCreate} handleClose={handleCloseModal2} />
      )}
    </ThemeProvider>
  );
};

export default Products;
