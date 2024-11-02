import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "../../utils/authUtils.js";
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

const MyProducts = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterOption, setFilterOption] = useState({ rating: 0, budget: Infinity });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/access/seller/searchMyProducts?sellerId=6703da7a68612863e0903056`);
      setProducts(response.data);
    } catch (error) {
      setErrorMessage("Error fetching products: " + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.rating >= filterOption.rating && product.price <= filterOption.budget)
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder("");
    setFilterOption({ rating: 0, budget: Infinity });
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              My Products
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          {/* <Typography variant="h3" align="center" color="primary" gutterBottom>
            My Products
          </Typography> */}

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
            <TextField label="Max Price" type="number" variant="outlined" onChange={(e) => setFilterOption({ ...filterOption, budget: e.target.value })} sx={{ mr: 2, width: "150px" }} />
            <Button variant="contained" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Box>

          {/* Products Display */}
          <div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card>
                      {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
                        <CardMedia component="img" height="140" image={product.imageUrl[0]} alt={product.name} />
                      ) : (
                        <CircularProgress />
                      )}
                      <CardContent>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography>Price: ${product.price}</Typography>
                        <Typography>Details: {product.details}</Typography>
                        <Rating name="read-only" value={product.rating} readOnly />
                        <Typography>Quantity: {product.quantity}</Typography>
                        <Typography>Category: {product.category}</Typography>
                        <Typography>Sales: {product.sales}</Typography>

                        {product.salesHistory && product.salesHistory.length > 0 ? (
                          <div>
                            <Typography variant="h6">Sales History</Typography>
                            <ul>
                              {product.salesHistory.map((sale, index) => (
                                <li key={index}>
                                  Quantity Sold: {sale.quantity}, Date: {new Date(sale.date).toLocaleString()}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <Typography>No sales history available.</Typography>
                        )}
                        {product.reviews && product.reviews.length > 0 ? (
                          <div>
                            <Typography variant="h6">Reviews</Typography>
                            <ul>
                              {product.reviews.map((review, index) => (
                                <li key={index}>
                                  Review ID: {review._id}, Rating: {review.rating}, {review.comment}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <Typography>No reviews, be the first to give feedback.</Typography>
                        )}
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

export default MyProducts;
