import { useState } from "react";
import "./app2.css";
import { Container } from "@mui/material";
import axios from "axios";
import { Badge, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { Backdrop } from "@mui/material";
import { useParams, Link } from "react-router-dom"; // Import useParams for URL params
import { getUserType, getUserId } from "../../../../utils/authUtils"; // Import the auth utility functions
import { ShoppingCart } from "@mui/icons-material";

export function TrashIcon() {
  return (
    <svg
      width="14"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"
          id="a"
        />
      </defs>
      <use fill="#C3CAD9" fillRule="nonzero" xlinkHref="#a" />
    </svg>
  );
}
const Cart = ({
  onShow,
  products,
  productDetails,
  quantArray,
  setItemCount,
  setProductList,
  totalPrice,
  setTotal,
}) => {
  return (
    <section className="cart">
      <div className="head">
        <p style={{ color: "black" }}>Cart</p>
        <p style={{ marginLeft: "200px", color: "black" }}>
          {totalPrice} EGP
        </p>{" "}
      </div>

      <hr />
      <div className="cart-content">
        {/* Make this section scrollable */}
        <div className="scrollable-product-list">
          {productDetails && productDetails.length > 0 ? (
            productDetails.map((product, index) => {
              return (
                <Product
                  key={product._id} // Unique key for each product
                  products={product} // Pass the product details
                  quantArray={quantArray}
                  PID={product._id} // Unique key for each product
                  setItemCount={setItemCount}
                  setProductList={setProductList}
                  setTotal={setTotal}
                />
              );
            })
          ) : (
            <p>No products available</p> // Display if no products
          )}
        </div>
        <Link
          to="/tourist/mycart"
          style={{ textDecoration: "none", width: "100%" }}
        >
          <button
            className="checkout"
            onClick={() => {
              onShow(false);
            }}
          >
            View cart
          </button>
        </Link>
      </div>
    </section>
  );
};

const Product = ({
  products,
  quantArray,
  PID,
  setItemCount,
  setProductList,
  setTotal,
}) => {
  const quant = quantArray.filter((item) => item.product === PID); // Use filter instead of findAll
  const quantity = quant.length > 0 ? quant[quant.length - 1] : undefined; // Access the last element safely

  return (
    <div className="product">
      <img
        src={
          products.imageUrl && products.imageUrl.length > 0
            ? `http://localhost:8000/${products.imageUrl[0].substring(
                products.imageUrl[0].indexOf("uploads/")
              )}`
            : ""
        }
        alt="product-thumbnail"
      />
      <div className="info">
        <p>fall limited edition sneakers</p>
        <div className="price">
          <span>
            {" "}
            {`${products.price.toFixed(2)} EGP x ${quantity.quantity}`}{" "}
          </span>
          <span> {`${(products.price * quantity.quantity).toFixed(2)} EGP`} </span>
        </div>
      </div>
      <IconButton
        className="delete-button"
        size="small"
        disableRipple
        onClick={() => {
          removeFromCart(products._id, setProductList, setItemCount, setTotal);
        }}
      >
        <TrashIcon /> {/* Use the TrashIcon component instead of the img tag */}
      </IconButton>
    </div>
  );
};

export const getTouristCart = async (
  setProductList,
  setItemCount,
  setTotal
) => {
  try {
    const touristId = getUserId(); // Get the tourist ID

    const response = await axios.get(
      `http://localhost:8000/tourist/cart?touristId=${touristId}`
    );
    setItemCount(response.data.itemCount);
    setProductList(response.data.products); // Update the state with the cart data
    setTotal(response.data.totalPrice);
  } catch (error) {
    console.error("Error fetching tourist cart: " + error.message);
  }
};

export const removeFromCart = async (
  productId,
  setProductList,
  setItemCount,
  setTotal
) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/tourist/cart/remove`,
      {
        productId,
        touristId: getUserId(), // Assuming getUserId() retrieves the tourist's ID
      }
    );

    const updatedCart = response.data.cart; // Backend returns the updated cart

    // Find the product in the cart by productId
    const productInCart = updatedCart.products.find(
      (item) => item.product === productId
    );
    setProductList(updatedCart.products);
    setItemCount(updatedCart.itemCount);
    setTotal(updatedCart.totalPrice);
    // Update total price in the UI
  } catch (error) {
    console.error("Error removing product from cart:", error.message);
  }
};
export const fetchProductDetails = async (
  productList,
  setProductDetails,
  setQuantArray
) => {
  try {
    const productDetailsPromises = productList.map(async (item) => {
      const response = await axios.get(
        `http://localhost:8000/access/seller/SearchProductById?id=${item.product}`
      );
      setQuantArray((prev) => [
        ...prev,
        { product: item.product, quantity: item.quantity },
      ]);
      return response.data; // Return the fetched product details
    });

    // Wait for all promises to resolve
    const allProductDetails = await Promise.all(productDetailsPromises);

    // Update the state with the fetched product details
    setProductDetails(allProductDetails);
  } catch (error) {
    console.error("Error fetching product details: " + error.message);
  }
};
const CartIcon = () => {
  return (
    <svg width="22" height="20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z"
        fill="#69707D"
        fillRule="nonzero"
      />
    </svg>
  );
};
const CloseIcon = ({ fillColor }) => {
  return (
    <svg width="14" height="15" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
        fill={`${fillColor}`}
        fillRule="evenodd"
      />
    </svg>
  );
};

function App() {
  const [productList, setProductList] = useState([]); // Initialize the product list state
  const [productDetails, setProductDetails] = useState([]); // Initialize the product details state
  const [quantArray, setQuantArray] = useState([]); // Initialize the quantity array state
  const [itemCount, setItemCount] = useState(0); // Initialize the item count state
  const [showCart, setShowCart] = useState(false); // Initialize the show cart state
  const [totalPrice, setTotal] = useState(0); // Initialize the total price state

  useEffect(() => {
    // Define a function to fetch data at regular intervals
    const fetchCartData = () => {
      getTouristCart(setProductList, setItemCount, setTotal);
    };
  
    // Call the function immediately on component mount
    fetchCartData();
  
    // Set up the interval to call the function every 10 seconds
    const intervalId = setInterval(fetchCartData, 5000); // 10 seconds = 10000 milliseconds
  
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {
    console.log("this is the product list", productList);
    fetchProductDetails(productList, setProductDetails, setQuantArray);
  }, [productList]);

  return (
    <Container>
      <header className="main-header">
        <div className="right">
          <IconButton
            disableRipple
            onClick={() => {
              setShowCart(!showCart);
            }}
          >
            <Badge
              invisible={itemCount === 0}
              badgeContent={itemCount}
              variant="standard"
              sx={{
                color: "#fff",
                fontFamily: "Kumbh sans",
                fontWeight: 700,
                "& .css-fvc8ir-MuiBadge-badge ": {
                  fontFamily: "kumbh sans",
                  fontWeight: 700,
                },
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>

          {showCart && (
            <Cart
              products={productList}
              onShow={setShowCart}
              productDetails={productDetails}
              quantArray={quantArray}
              itemCount={itemCount}
              setItemCount={setItemCount}
              setProductList={setProductList}
              totalPrice={totalPrice}
              setTotal={setTotal}
            />
          )}
        </div>
      </header>
    </Container>
  );
}
export default App;
