import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserType, getUserId } from "../../../utils/authUtils";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBRipple,
  MDBBtn,
} from "mdb-react-ui-kit";
import { IconButton } from "@mui/material";
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
function product() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sellerNames, setSellerNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterOption, setFilterOption] = useState({ rating: 0 });
  const [budget, setBudget] = useState(""); // State for budget
  const [effect, setEffect] = useState("");
  const [wishArray, setWishArray] = useState([]);

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
  const handleAddToCart = async (productId) => {
    try {
      // API call with `productId` in the request body
      const response = await axios.put(
        "http://localhost:8000/tourist/cart/add",
        { productId: productId, touristId: getUserId() } // Use `productId`
      );
      alert("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add the product to cart.");
    }
  };

  return (
    <MDBContainer fluid>
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
          marginTop: "30px",
        }}
      >
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
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
          <InputLabel sx={{ fontSize: "0.875rem", marginTop: "10px" }}>
            Filter by Rating
          </InputLabel>

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
      {filteredProducts.map((product) => (
        <MDBRow className="justify-content-center mb-0">
          <MDBCol md="12" xl="10">
            <MDBCard className="shadow-0 border rounded-3 mt-5 mb-3">
              <MDBCardBody>
                <MDBRow key={product._id}>
                  <MDBCol md="12" lg="3" className="mb-4 mb-lg-0">
                    <MDBRipple
                      rippleColor="light"
                      rippleTag="div"
                      className="bg-image rounded hover-zoom hover-overlay"
                    >
                      {Array.isArray(product.imageUrl) &&
                      product.imageUrl.length > 0 ? (
                        <MDBCardImage
                          src={`http://localhost:8000/${product.imageUrl[0].substring(
                            product.imageUrl[0].indexOf("uploads/")
                          )}`}
                          fluid
                          className="w-100"
                          alt={product.name}
                        />
                      ) : (
                        <CircularProgress
                          style={{ margin: "auto", display: "block" }}
                          size={50}
                        />
                      )}
                      <a href="#!">
                        <div
                          className="mask"
                          style={{
                            backgroundColor: "rgba(251, 251, 251, 0.15)",
                          }}
                        ></div>
                      </a>
                    </MDBRipple>
                  </MDBCol>
                  <MDBCol md="6">
                    <h5>{product.name}</h5>
                    <div className="d-flex flex-row">
                      <Rating
                        name="read-only"
                        value={product.rating}
                        readOnly
                      />
                    </div>

                    <div className="mb-2 text-muted small">
                      {product.details}
                    </div>
                    <div className="mb-2 text-muted small">
                      {product.reviews && product.reviews.length > 0 ? (
                        <div>
                          <Typography variant="h6">Sales History</Typography>
                          <ul>
                            {product.reviews.map((review, index) => (
                              <li key={index}>
                                Review ID: {review._id}, Rating: {review.rating}
                                , {review.comment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Typography>
                          No reviews, be the first one to give feedback.
                        </Typography>
                      )}
                    </div>
                  </MDBCol>
                  <MDBCol
                    md="6"
                    lg="3"
                    className="border-sm-start-none border-start"
                  >
                    <div className="d-flex flex-row align-items-center mb-1">
                      <h4 className="mb-1 me-1">${product.price}</h4>
                    </div>
                    <div className="d-flex flex-column mt-4">
                      <MDBBtn color="primary" size="sm">
                        Details
                      </MDBBtn>
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
                      <MDBBtn
                        outline
                        color="primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        <ShoppingCartIcon />
                        Add to Cart
                      </MDBBtn>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      ))}
    </MDBContainer>
  );
}

export default product;
