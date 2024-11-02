import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRadio,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import { IconButton, TextField, TableCell, TableRow } from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css"; // Ensure MDB's CSS is imported
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap's CSS
import { Add, Remove, Delete } from "@mui/icons-material";
import { getUserId } from "../../utils/authUtils";
export default function SummaryPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/cart/?touristId=671588c2d1737e8194e237c5"
      );
      setCart(response.data);
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
        console.log(products);
      } catch (error) {
        setErrorMessage(
          "Error fetching products in the cart: " + error.message
        );
      }
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tourist/cart/update`,
        {
          touristId: getUserId(),
          productId,
          quantity,
        }
      );
      setCart(response.data.cart);
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

  const handleIncrement = async (productId, currentQuantity) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/tourist/cart/update",
        {
          touristId: getUserId(),
          productId,
          number: currentQuantity + 1, // Increment by 1
        }
      );
      setCart(response.data.cart); // Update cart with the new data
    } catch (error) {
      setErrorMessage("Error updating cart: " + error.message);
    }
  };

  // Handle decrementing the product quantity
  const handleDecrement = async (productId, currentQuantity) => {
    try {
      const newQuantity = currentQuantity - 1;
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

  return (
    <section className="h-100 h-custom">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBTable responsive>
              <MDBTableHead>
                <tr>
                  <th scope="col" className="h5">
                    Shopping Bag
                  </th>
                  <th scope="col"></th>
                  <th scope="col">Format</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col"></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <th scope="row">
                      <div className="d-flex align-items-center">
                        {Array.isArray(product.imageUrl) &&
                        product.imageUrl.length > 0 ? (
                          <img
                            src={
                              "https://shuttershopegypt.com/wp-content/uploads/2024/08/Microsoft-Surface-Laptop-4-i7.webp2_.webp"
                            } // Safely accessing the first image
                            className="rounded-3 img-fluid"
                            style={{ width: "120px" }}
                            alt={product.name}
                          />
                        ) : (
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <p>No Image</p>
                          </div> // Placeholder when no image is available
                        )}
                      </div>
                    </th>
                    <td className="align-middle">
                      <p className="mb-0" style={{ fontWeight: "500" }}>
                        {product.name}
                      </p>
                    </td>
                    <td className="align-middle">
                      <p className="mb-0" style={{ fontWeight: "500" }}>
                        {product.category}
                      </p>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex flex-row align-items-center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleDecrement(product._id, product.quantity)
                          }
                        >
                          <Remove />
                        </IconButton>

                        <TextField
                          type="number"
                          size="small"
                          value={product.quantity}
                          inputProps={{
                            min: 0,
                            style: { textAlign: "center" },
                          }}
                          style={{ width: "200px" }}
                        />

                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleIncrement(product._id, product.quantity)
                          }
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </td>
                    <td className="align-middle">
                      <p className="mb-0" style={{ fontWeight: "500" }}>
                        ${product.price}
                      </p>
                    </td>
                    <td className="align-middle">
                      <IconButton
                        color="error"
                        onClick={() => handleRemove(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
          <MDBCard
            className="shadow-2-strong mb-5 mb-lg-0"
            style={{ borderRadius: "16px" }}
          >
            <MDBCardBody className="p-4">
              <MDBRow>
                <MDBCol md="6" lg="4" xl="3" className="mb-4 mb-md-0">
                  <form>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <MDBRadio
                          type="radio"
                          name="radio1"
                          checked
                          value=""
                          aria-label="..."
                        />
                      </div>
                      <div className="rounded border w-100 p-3">
                        <p className="d-flex align-items-center mb-0">
                          <MDBIcon
                            fab
                            icon="cc-mastercard fa-2x text-dark pe-2"
                          />
                          Credit Card
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <MDBRadio
                          type="radio"
                          name="radio1"
                          checked
                          value=""
                          aria-label="..."
                        />
                      </div>
                      <div className="rounded border w-100 p-3">
                        <p className="d-flex align-items-center mb-0">
                          <MDBIcon fab icon="cc-visa fa-2x text-dark pe-2" />
                          Debit Card
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <MDBRadio
                          type="radio"
                          name="radio1"
                          checked
                          value=""
                          aria-label="..."
                        />
                      </div>
                      <div className="rounded border w-100 p-3">
                        <p className="d-flex align-items-center mb-0">
                          <MDBIcon fab icon="cc-paypal fa-2x text-dark pe-2" />
                          PayPal
                        </p>
                      </div>
                    </div>
                  </form>
                </MDBCol>
                <MDBCol md="6" lg="4" xl="6">
                  <MDBRow>
                    <MDBCol size="12" xl="6">
                      <MDBInput
                        className="mb-4 mb-xl-5"
                        label="Name on card"
                        placeholder="Name on card"
                        size="lg"
                      />
                      <MDBInput
                        className="mb-4 mb-xl-5"
                        label="Expiration"
                        placeholder="MM/YY"
                        size="lg"
                        maxLength={7}
                        minLength={7}
                      />
                    </MDBCol>

                    <MDBCol size="12" xl="6">
                      <MDBInput
                        className="mb-4 mb-xl-5"
                        label="Card Number"
                        placeholder="xxxx xxxx xxxx xxxx"
                        size="lg"
                        minlength="19"
                        maxlength="19"
                      />
                      <MDBInput
                        className="mb-4 mb-xl-5"
                        label="Cvv"
                        placeholder="Cvv;"
                        size="lg"
                        minlength="3"
                        maxlength="3"
                        type="password"
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
                <MDBCol lg="4" xl="3">
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <p className="mb-2">Subtotal</p>
                    <p className="mb-2">${cart.totalPrice}.00</p>
                  </div>

                  <div
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <p className="mb-0">Shipping</p>
                    <p className="mb-0">$2.99</p>
                  </div>

                  <hr className="my-4" />

                  <div
                    className="d-flex justify-content-between mb-4"
                    style={{ fontWeight: "500" }}
                  >
                    <p className="mb-2">Total (tax included)</p>
                    <p className="mb-2">
                      ${parseFloat(cart.totalPrice + 2.99).toFixed(2)}
                    </p>
                  </div>

                  <MDBBtn block size="lg">
                    <div className="d-flex justify-content-between">
                      <span>Checkout</span>
                      <span>
                        ${parseFloat(cart.totalPrice + 2.99).toFixed(2)}
                      </span>
                    </div>
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
