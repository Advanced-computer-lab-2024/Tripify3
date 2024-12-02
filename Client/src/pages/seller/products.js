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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {getUserProfile } from "../../services/tourist";//////////////////////////////////
import { useParams, useNavigate } from "react-router-dom";////////////////////////

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
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  if (!images || images.length === 0) return null;

  const imagePath = images[currentImageIndex]; // Get the full file path
  console.log("Original Image Path:", imagePath); // Log the original path for debugging

  // Normalize the path to use forward slashes
  const normalizedPath = imagePath.replace(/\\/g, "/");

  // Extract the part after "uploads/" to create a relative path
  const relativeImagePath = normalizedPath.substring(normalizedPath.indexOf("uploads/"));

  // Construct the correct URL
  const imageUrl = `http://localhost:8000/${relativeImagePath}`;
  console.log("Generated Image URL:", imageUrl); // Log the final URL

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
        image={imageUrl}
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
  const { id } = useParams();/////////
  const userId = getUserId();////////////
  const [currency, setCurrency] = useState("USD"); // Default currency///////////////
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
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (productId) => {
    try {
      // API call with `productId` in the request body
      const response = await axios.put(
        "http://localhost:8000/tourist/cart/add",
        { productId: productId, touristId: getUserId() } // Use `productId`
      );
      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/access/seller/searchAllProducts");
      if (getUserType() === "Seller") {
        setProducts(response.data.filter((product) => product.sellerId === getUserId()));
      } else {
        setProducts(response.data.filter((product) => product.quantity > 0));
      }
      fetchSellerNames(response.data);
    } catch (error) {
      setErrorMessage("Error fetching products: " + error.message);
    }
  };

  const fetchSellerNames = async (products) => {
    try {
      // Extract sellerIds or fallback to adminIds if sellerId is null
      const sellerIds = [
        ...new Set(
          products.map((product) => product.sellerId || product.adminId) // Fallback to adminId if sellerId is null
        ),
      ];
  
      // Fetch seller/admin names for each unique ID
      const sellerPromises = sellerIds.map((id) =>
        axios.get(`http://localhost:8000/access/seller/find/seller?id=${id}`)
      );
  
      const sellerResponses = await Promise.all(sellerPromises);
  
      // Map responses to an object with ID as key and name as value
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
      const response = await axios.get(`http://localhost:8000/tourist/wishlist/get?touristId=${getUserId()}`);
      setWishArray(response.data.items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      alert("Failed to fetch the wishlist. ");
    }
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile(); // Fetch currency when the component mounts
    fetchProducts();
  }, [effect, wishArray,id,userId]);
  useEffect(() => {
    if (getUserType() === "Tourist") fetchWishList();
  }, []);

  const filteredProducts = products
    .filter(
      (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.rating >= filterOption.rating && product.price <= (budget || Infinity) // Filter by budget
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
  const exchangeRates = {
    USD: 1 / 49,  // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52,  // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63,  // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32,  // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35,  // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
};

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }

     // Ensure amount is a number
     const value = Number(amount);
  

    // Check user type and apply currency logic
    if (getUserType() !== "Tourist") {
      // If user is not Tourist, format amount in EGP
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'EGP' 
      }).format(value);
    }
  
   
    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = (currency === "EGP") ? value : value * ( exchangeRates[currency]);
  
    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

      const formattedAmount = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency 
      }).format(convertedAmount);
      
      return formattedAmount.replace(/(\D)(\d)/, '$1 $2');
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
        setWishArray((prevWishArray) => prevWishArray.filter((id) => id !== productId));
      }
    } catch (error) {
      console.error("Error archiving product:", error);
      // alert("Failed to add to wishList. ");
    }
  };

  const handleUpdate = async (product) => {
    try {
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
    } catch (error) {
      console.error("Error updating product", error.response?.data || error.message);
    }
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
      const useIndex = missingIndices.length > 0 ? missingIndices.shift() : nextIndex++;
      newFormData.append("images", image, `${product.name}-${useIndex}.${image.name.split(".").pop()}`);
    });

    try {
      const response = await axios.put(`http://localhost:8000/access/seller/editProduct`, newFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-id": getUserId(),
        },
      });

      setNewImage([]);
    } catch (error) {
      console.error("Error updating product", error.response?.data || error.message);
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
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>
              Product List
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
      

          {/* Search Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <TextField label="Search Products" variant="outlined" onChange={(e) => setSearchTerm(e.target.value)} sx={{ mr: 2, width: "300px" }} />
            <FormControl variant="outlined" sx={{ mr: 2, width: "150px" }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort by Price">
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Budget" variant="outlined" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} sx={{ mr: 2, width: "150px" }} />
            <Button variant="contained" onClick={() => setSortOrder(sortOrder)}>
              Sort
            </Button>
            <Button variant="contained" color="secondary" onClick={resetFilters} sx={{ ml: 2 }}>
              Reset Filters
            </Button>
          </Box>

          {/* Filter Section */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
              <InputLabel>Filter by Rating</InputLabel>
              <Select value={filterOption.rating} onChange={(e) => setFilterOption({ rating: e.target.value })}>
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
                          {wishArray.includes(product._id) ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
                        </IconButton>
                      )}

                      {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
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
                      <Link
                        to={`/product/${product._id}`} // Link to the product page
                        style={{ textDecoration: "none", color: "inherit" }} // Ensures link doesn't affect card styling
                      >
                        <CardContent>
                          <Typography variant="h5">{product.name}</Typography>
                          <Typography>Price: {formatCurrency(product.price)}</Typography>
                          <Typography>Details: {product.details}</Typography>
                          <Rating name="read-only" value={product.rating} readOnly />

                          {getUserType() !== "Tourist" ? <Typography>Quantity: {product.quantity}</Typography> : null}

                          <Typography>Category: {product.category}</Typography>
                          {getUserType() !== "Tourist" ? <Typography>Sales: {product.sales}</Typography> : null}

                          {product.reviews && product.reviews.length > 0 ? (
                            <div>
                              <Typography variant="h6">Sales History</Typography>
                              <ul>
                                {product.reviews.map((review, index) => (
                                  <li key={index}>
                                    Review ID: {review._id}, Rating: {review.rating}, {review.comment}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <Typography>No reviews, be the first one to give feedback.</Typography>
                          )}

                          <Typography>Seller: {sellerNames[product.sellerId] ? <Link to={`/seller/${product.sellerId}`}>{sellerNames[product.sellerId]}</Link> : "Loading seller name..."}</Typography>
                        </CardContent>
                      </Link>
                      {getUserType() == "Tourist" ? (
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={async () => {
                            if (!loading) {
                              setLoading(true);
                              await handleAddToCart(product._id);
                            }
                            setTimeout(() => {
                              setLoading(false);
                            }, 5000);
                          }} // Assuming you have an add-to-cart function
                          sx={{
                            width: "80%",
                            margin: "16px auto", // Center the button with margin on top and bottom
                            display: "block", // Center align in the card
                            background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "none",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                              background: "linear-gradient(45deg, #FF5A5A, #FFC837)",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      ) : null}
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
                    onClick={() => {
                      if (getUserType() === "Seller" || getUserType() === "Admin") {
                        setOpenCreate(true);
                      }
                    }}
                  >
                    {getUserType() === "Seller" || getUserType() === "Admin" ? <AddIcon /> : null}
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
      {openCreate && <ProductCreateModal open={openCreate} handleClose={handleCloseModal2} />}
    </ThemeProvider>
  );
};

export default Products;
