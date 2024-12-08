import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import React from "react";
import { IconButton, TextField, TableCell, TableRow } from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css"; // Ensure MDB's CSS is imported
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap's CSS
import { Add, Remove, Delete } from "@mui/icons-material";
import { getUserId } from "../../utils/authUtils";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function QuantityEdit() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("1");
  const [deliveryPrice, setDeliveryPrice] = useState(10);
  const [quant, setQuant] = useState([]);
  const today = new Date();
  today.setDate(today.getDate() + 3);
  today.setHours(12, 0, 0, 0); // Set time to 12 PM
  const [dropOffDate, setDropOffDate] = useState(today.toISOString()); // Store the calculated date

  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [form, setForm] = useState({
    location: "",
  });

  const handleCheckout = async () => {
    navigate(
      `/tourist/select/address/${cart.totalPrice}/Product/${dropOffDate}/${deliveryPrice}`
    );
  };

  const handleDeliveryChange = (event) => {
    const selectedValue = event.target.value; // Get the selected value
    setSelectedDelivery(selectedValue); // Update the state with the selected value

    // Calculate the drop-off date based on the selected delivery option
    const now = new Date();
    switch (selectedValue) {
      case "1":
        now.setDate(now.getDate() + 3);
        now.setHours(12, 0, 0, 0); // Set time to 12 PM
        break;
      case "2": // Express-Delivery
        now.setDate(now.getDate() + 1);
        now.setHours(12, 0, 0, 0); // Set time to 12 PM
        break;
      default: // Standard-Delivery
        break;
    }

    setDropOffDate(now.toISOString()); // Convert to ISO string for consistent format

    // const selectedText = event.target.options[event.target.selectedIndex].text;
    // const price = selectedText.split("$")[1].trim(); // Get substring after "$" and trim whitespace
    if (selectedValue === "2") {
      setDeliveryPrice(20.0); // Update the delivery price
    } else {
      setDeliveryPrice(10.0); // Update the delivery price
    }
  };
  const getCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/tourist/cart/?touristId=${getUserId()}`
      );
      setCart(response.data);
      console.log(response.data);
      console.log("---------------------------");
    } catch (error) {
      setErrorMessage("Error fetching cart: " + error.message);
    }
  };
  const getProdInCart = async () => {
    if (cart && cart.products && cart.products.length > 0) {
      try {
        const productDetails = await Promise.all(
          cart.products.map(async (item) => {
            const response = await axios.get(
              `http://localhost:8000/access/seller/SearchProductById?id=${item.product}`
            );
            return { ...response.data, quantity: item.quantity }; // Add quantity to product details
          })
        );

        setProducts(productDetails);
        const updatedQuant = cart.products.map((item) => ({
          productId: item.product,
          quantity: item.quantity,
        }));

        setQuant(updatedQuant); // Set the quant state with the array of objects
        console.log(updatedQuant);
      } catch (error) {
        setErrorMessage(
          "Error fetching products in the cart: " + error.message
        );
      }
    }
  };

  const updateCart = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity;
      const response = await axios.put(
        "http://localhost:8000/tourist/cart/update",
        {
          touristId: getUserId(),
          productId,
          number: newQuantity < 0 ? 0 : newQuantity, // Decrement by 1
        }
      );
      setCart(response.data.cart); // Update cart with the new data
    } catch (error) {
      setErrorMessage("Error updating cart: " + error.message);
    }
  };
  useEffect(() => {
    getCart();
  }, []); // Only run once on component mount

  useEffect(() => {
    if (cart) {
      getProdInCart();
    }
  }, [cart]); // Runs every time 'cart' changes

  const handleIncrement = (productId) => {
    // Optimistically update the quantity in the UI
    setQuant((prevQuant) =>
      prevQuant.map((q) =>
        q.productId === productId
          ? { ...q, quantity: Math.max(0, parseInt(q.quantity) + 1) }
          : q
      )
    );

    // Clear any existing timeout to prevent multiple API calls
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to call the API after the user stops pressing the button
    const newTimeout = setTimeout(() => {
      // Use functional state update to get the latest value of `quant`
      setQuant((currentQuant) => {
        const updatedQuantity =
          currentQuant.find((q) => q.productId === productId)?.quantity || 0;
        updateCart(productId, updatedQuantity); // Call the API with the latest quantity
        return currentQuant; // Return current state
      });
    }, 1000); // Debounce time of 1 second for smoother experience

    setDebounceTimeout(newTimeout); // Save the timeout so it can be cleared on the next press
  };

  const handleDecrement = (productId) => {
    // Optimistically update the quantity in the UI
    setQuant((prevQuant) =>
      prevQuant.map((q) =>
        q.productId === productId
          ? { ...q, quantity: Math.max(0, parseInt(q.quantity) - 1) }
          : q
      )
    );

    // Clear any existing timeout to prevent multiple API calls
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to call the API after the user stops pressing the button
    const newTimeout = setTimeout(() => {
      // Use functional state update to get the latest value of `quant`
      setQuant((currentQuant) => {
        const updatedQuantity =
          currentQuant.find((q) => q.productId === productId)?.quantity || 0;
        updateCart(productId, updatedQuantity); // Call the API with the latest quantity
        return currentQuant; // Return current state
      });
    }, 1000); // Debounce time of 1 second for smoother experience

    setDebounceTimeout(newTimeout); // Save the timeout so it can be cleared on the next press
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/tourist/cart/update",
        {
          touristId: getUserId(),
          productId,
          number: 0, // Set quantity to 0 to remove the item
        }
      );

      setCart(response.data.cart); // Update cart with the new data
    } catch (error) {
      setErrorMessage("Error updating cart: " + error.message);
    }
  };

  // )

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 text-black"
                        >
                          Shopping Cart
                        </MDBTypography>
                        <MDBTypography className="mb-0 text-muted">
                          {cart ? cart.itemCount : 0} items
                        </MDBTypography>
                      </div>

                      <hr className="my-4" />

                      {cart &&
                        cart.products &&
                        cart.products.length > 0 &&
                        products.map((product) => (
                          <React.Fragment key={product._id}>
                            <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                              <MDBCol md="2" lg="2" xl="2">
                                <MDBCardImage
                                  src={
                                    Array.isArray(product.imageUrl) &&
                                    product.imageUrl.length > 0
                                      ? `http://localhost:8000/${product.imageUrl[0].substring(
                                          product.imageUrl[0].indexOf(
                                            "uploads/"
                                          )
                                        )}`
                                      : "https://shuttershopegypt.com/wp-content/uploads/2024/08/Microsoft-Surface-Laptop-4-i7.webp2_.webp"
                                  }
                                  fluid
                                  className="rounded-3"
                                  alt={product.name}
                                />
                              </MDBCol>

                              <MDBCol md="3" lg="3" xl="3">
                                <MDBTypography tag="h6" className="text-muted">
                                  {product.category}
                                </MDBTypography>
                                <MDBTypography
                                  tag="h6"
                                  className="text-black mb-0"
                                >
                                  {product.name}
                                </MDBTypography>
                              </MDBCol>

                              <MDBCol
                                md="3"
                                lg="3"
                                xl="3"
                                className="d-flex align-items-center"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleDecrement(
                                      product._id,
                                      product.quantity
                                    )
                                  }
                                >
                                  <Remove />
                                </IconButton>

                                <MDBInput
                                  type="number"
                                  size="sm"
                                  value={
                                    quant.find(
                                      (q) => q.productId === product._id
                                    )?.quantity
                                  }
                                  onChange={(e) =>
                                    setQuant(
                                      quant.map((q) =>
                                        q.productId === product._id
                                          ? { ...q, quantity: e.target.value }
                                          : q
                                      )
                                    )
                                  }
                                  onBlur={() =>
                                    updateCart(
                                      product._id,
                                      quant.find(
                                        (q) => q.productId === product._id
                                      )?.quantity || 0
                                    )
                                  }
                                />

                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleIncrement(
                                      product._id,
                                      product.quantity
                                    )
                                  }
                                >
                                  <Add />
                                </IconButton>
                              </MDBCol>

                              <MDBCol md="3" lg="2" xl="2" className="text-end">
                                <MDBTypography tag="h6" className="mb-0">
                                  {product.price.toFixed(2)} EGP
                                </MDBTypography>
                              </MDBCol>

                              <MDBCol md="1" lg="1" xl="1" className="text-end">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemove(product._id)}
                                >
                                  <Delete />
                                </IconButton>
                              </MDBCol>
                            </MDBRow>
                            <hr className="my-4" />
                          </React.Fragment>
                        ))}

                      <hr className="my-4" />

                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText
                            tag="a"
                            href="products"
                            className="text-body"
                          >
                            <MDBIcon fas icon="long-arrow-alt-left me-2" /> Back
                            to shop
                          </MDBCardText>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1"
                      >
                        Summary
                      </MDBTypography>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-4">
                        <MDBTypography tag="h5" className="text-uppercase">
                          {cart ? cart.itemCount : 0} items
                        </MDBTypography>
                        <MDBTypography tag="h5">
                          {cart && cart.totalPrice}.00 EGP
                        </MDBTypography>
                      </div>

                      <MDBTypography tag="h5" className="text-uppercase mb-3">
                        Shipping
                      </MDBTypography>

                      <div className="mb-4 pb-2">
                        <select
                          className="select p-2 rounded bg-grey"
                          style={{ width: "100%" }}
                          value={selectedDelivery} // Bind the select value to the state
                          onChange={handleDeliveryChange}
                        >
                          <option value="1">
                            Standard-Delivery - 10.00 EGP
                          </option>
                          <option value="2">
                            Next-Day-Delivery - 20.00 EGP
                          </option>
                        </select>
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography tag="h5" className="text-uppercase">
                          Total price
                        </MDBTypography>
                        <MDBTypography tag="h5">
                          {cart && cart.totalPrice
                            ? deliveryPrice
                              ? (
                                  parseFloat(cart.totalPrice) +
                                  parseFloat(deliveryPrice)
                                ).toFixed(2)
                              : (
                                  parseFloat(cart.totalPrice) + parseFloat(10.0)
                                ).toFixed(2)
                            : "0.00"}{" "}
                          EGP
                        </MDBTypography>
                      </div>

                      <MDBBtn
                        color="dark"
                        block
                        size="lg"
                        onClick={handleCheckout}
                      >
                        Checkout
                      </MDBBtn>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
