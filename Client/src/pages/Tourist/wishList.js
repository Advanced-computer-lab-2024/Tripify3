import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserType, getUserId } from "../../utils/authUtils";
import { IconButton } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive"; // Import an archive icon
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f", // Dark blue
    },
    secondary: {
      main: "#ff6f00", // Orange
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
      const response = await axios.get(
        "http://localhost:8000/access/seller/searchAllProducts"
      );
      if (getUserType() === "Tourist") {
        setProducts(
          response.data.filter((product) => wishArray.includes(product._id) && product.quantity > 0)
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
        ...new Set(
          products.map((product) => product.sellerId || product.adminId) // Fallback to adminId if sellerId is null
        ),
      ];

      const sellerPromises = sellerIds.map((sellerId) =>
        axios.get(
          `http://localhost:8000/access/seller/find/seller?id=${sellerId}`
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
      console.log(response.data.items);

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

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              My WishList
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

          {/* Products Display */}
          <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card style={{ position: "relative" }}>
                      {/* Archive Button in Top Right */}
                      {getUserType() !== "Tourist" ? (
                        <IconButton
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: "#fff",
                          }}
                          onClick={() => handleArchive(product._id)} // Function to handle archiving
                        >
                          <ArchiveIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: "#fff",
                          }}
                          onClick={() => handleWishlist(product._id)} // Function to handle archiving
                        >
                          {wishArray.includes(product._id) ? (
                            <FavoriteIcon style={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      )}

                      {Array.isArray(product.imageUrl) &&
                      product.imageUrl.length > 0 ? (
                        (() => {
                          const indexOfUploads =
                            product.imageUrl[0].indexOf("uploads/");
                          const relativePath =
                            product.imageUrl[0].substring(indexOfUploads);
                          return (
                            <CardMedia
                              component="img"
                              image={`http://localhost:8000/${relativePath}`}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                                minWidth: "200px",
                                minHeight: "200px",
                                maxWidth: "200px",
                                maxHeight: "200px",
                                margin: "auto",
                                marginTop: "20px",
                              }}
                              alt={product.name}
                            />
                          );
                        })()
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
                        <Typography>Price: {product.price} EGP</Typography>
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
                            <Typography variant="h6">Sales History</Typography>
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
                            background:
                              "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "none",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #FF5A5A, #FFC837)",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Products;
