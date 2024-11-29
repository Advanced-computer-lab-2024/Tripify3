import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserType, getUserId } from "../../utils/authUtils";
import { IconButton } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive"; // Import an archive icon
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
import { Block } from "@mui/icons-material";

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

  const fetchProducts = async () => {
    try {
      const sellerId = getUserId();
      const response = await axios.get(
        "http://localhost:8000/access/seller/searchAllArchivedProducts"
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

  useEffect(() => {
    fetchProducts();
  }, [effect]);

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
        "http://localhost:8000/access/seller/unarchiveProduct",
        { id: productId } // Sending the product id in the request body
      );
      alert("Product Unarchived successfully");
      setEffect(response.data);
    } catch (error) {
      console.error("Error Unarchiving product:", error);
      alert("Failed to Unarchive the product. ");
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
              Archived Product List
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
                                minWidth: "200px",
                                minHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
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
                        <CircularProgress />
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
