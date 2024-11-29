import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBRipple,
} from "mdb-react-ui-kit";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserType, getUserId } from "../../../utils/authUtils";

import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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

  return (
    <MDBContainer fluid className="my-5 text-center">
      <h4 className="mt-4 mb-5">
        <strong>Bestsellers</strong>
      </h4>
      <MDBRow>
        {filteredProducts.map((product) => (
          <MDBCol md="12" lg="4" className="mb-4">
            <MDBCard>
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
              <MDBRipple
                rippleColor="light"
                rippleTag="div"
                className="bg-image rounded hover-zoom"
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
                  <div className="mask">
                    <div className="d-flex justify-content-start align-items-end h-100">
                      <h5>
                        <span className="badge bg-primary ms-2">New</span>
                      </h5>
                    </div>
                  </div>
                  <div className="hover-overlay">
                    <div
                      className="mask"
                      style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                    ></div>
                  </div>
                </a>
              </MDBRipple>
              <MDBCardBody>
                <a href="#!" className="text-reset">
                  <h5 className="card-title mb-3">{product.name}</h5>{" "}
                  {/* Use product name */}
                </a>
                <a href="#!" className="text-reset">
                  <p>{product.category}</p> {/* Use product category */}
                </a>
                <h6 className="mb-3">${product.price}</h6>{" "}
                {/* Use product price */}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
}

export default product;
