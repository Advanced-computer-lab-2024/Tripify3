import { useState } from "react";
import "./App.css";
import { Container } from "@mui/material";
import axios from "axios";
import { Badge, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { Backdrop } from "@mui/material";
import { useParams } from "react-router-dom"; // Import useParams for URL params
import { getUserType, getUserId } from "../../../utils/authUtils";
import { Link } from "react-router-dom";

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
const NextIcon = () => {
  return (
    <svg width="13" height="18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m2 1 8 8-8 8"
        stroke="#1D2026"
        strokeWidth="3"
        fill="none"
        fillRule="evenodd"
      />
    </svg>
  );
};
export function Minus() {
  return (
    <svg
      width="12"
      height="4"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z"
          id="a"
        />
      </defs>
      <use fill="#FF7E1B" fillRule="nonzero" xlinkHref="#a" />
    </svg>
  );
}
export function Plus() {
  return (
    <svg
      width="12"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
          id="b"
        />
      </defs>
      <use fill="#FF7E1B" fillRule="nonzero" xlinkHref="#b" />
    </svg>
  );
}
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
export const Logo = () => {
  return (
    <svg width="138" height="20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.217 20c4.761 0 7.519-.753 7.519-4.606 0-3.4-3.38-4.172-6.66-4.682l-.56-.085-.279-.041-.35-.053c-2.7-.405-3.18-.788-3.18-1.471 0-.478.49-1.331 2.843-1.331 2.455 0 3.493.647 3.493 1.87v.134h4.281v-.133c0-2.389-1.35-5.238-7.774-5.238-5.952 0-7.201 2.584-7.201 4.752 0 3.097 2.763 4.086 7.223 4.675.21.028.433.054.659.081 1.669.197 3.172.42 3.172 1.585 0 1.01-1.615 1.222-3.298 1.222-2.797 0-3.784-.593-3.784-1.92v-.134H.002L0 14.926v.317c.008.79.118 1.913 1.057 2.862C2.303 19.362 4.712 20 8.217 20Zm13.21 0v-7.49c0-2.104.547-4.423 4.176-4.423 3.915 0 3.778 2.777 3.768 4.042V20h4.18v-7.768c0-2.264-.176-7.766-6.732-7.766-2.778 0-4.192.911-5.195 2.28h-.197V4.467H17.22V20h4.207Zm21.959 0c5.094 0 7.787-2.07 8.217-5.405H47.53c-.386 1.02-1.63 1.72-4.143 1.72-2.721 0-3.962-1.03-4.25-3.106h12.527c.24-2.13-.029-5.417-3.026-7.44v.005c-1.312-.915-3.056-1.465-5.251-1.465-5.24 0-8.336 2.772-8.336 7.845 0 5.17 3.02 7.846 8.336 7.846Zm4.099-9.574h-8.188c.486-1.574 1.764-2.431 4.089-2.431 2.994 0 3.755 1.267 4.099 2.431ZM70.499 20V4.457H66.29V6.74h-.176c-1.053-1.377-2.809-2.283-5.677-2.283-6.433 0-7.225 5.293-7.253 7.635v.137c0 2.092.732 7.771 7.241 7.771 2.914 0 4.684-.818 5.734-2.169h.131V20H70.5Zm-8.854-3.623c-3.996 0-4.447-3.032-4.447-4.148 0-1.21.426-4.148 4.455-4.148 3.631 0 4.374 2.044 4.374 4.148 0 2.35-.742 4.148-4.382 4.148ZM88.826 20l-6.529-9.045 6.588-6.488h-5.827l-6.836 6.756V0h-4.187v19.954h4.187V16.94l3.02-2.976L83.6 20h5.226Zm9.9 0c5.094 0 7.786-2.07 8.217-5.405h-4.074c-.387 1.02-1.63 1.72-4.143 1.72-2.721 0-3.962-1.03-4.25-3.106h12.527c.24-2.13-.029-5.417-3.026-7.44v.005c-1.312-.915-3.057-1.465-5.251-1.465-5.24 0-8.336 2.772-8.336 7.845 0 5.17 3.02 7.846 8.336 7.846Zm4.098-9.574h-8.187c.485-1.574 1.763-2.431 4.089-2.431 2.994 0 3.755 1.267 4.098 2.431ZM112.76 20v-6.97c0-2.103.931-4.542 4.05-4.542 1.33 0 2.393.236 2.785.346l.67-3.976c-.728-.16-1.626-.392-2.757-.392-2.665 0-3.622.794-4.486 2.282h-.262V4.466h-4.21V20h4.21Zm17.221 0c4.761 0 7.519-.753 7.519-4.606 0-3.4-3.38-4.172-6.66-4.682l-.56-.085-.279-.041-.349-.053c-2.701-.405-3.181-.788-3.181-1.471 0-.478.49-1.331 2.843-1.331 2.455 0 3.493.647 3.493 1.87v.134h4.282v-.133c0-2.389-1.35-5.238-7.775-5.238-5.952 0-7.201 2.584-7.201 4.752 0 3.097 2.763 4.086 7.224 4.675.21.028.432.054.658.081 1.669.197 3.172.42 3.172 1.585 0 1.01-1.615 1.222-3.298 1.222-2.796 0-3.784-.593-3.784-1.92v-.134h-4.319l-.001.301v.317c.008.79.117 1.913 1.056 2.862 1.246 1.257 3.655 1.895 7.16 1.895Z"
        fill="#1D2026"
        fillRule="nonzero"
      />
    </svg>
  );
};

const PreviousIcon = () => {
  return (
    <svg width="12" height="18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 1 3 9l8 8"
        stroke="#1D2026"
        strokeWidth="3"
        fill="none"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Navbar = ({
  onOrderedQuant,
  onReset,
  products,
  setOrderedQuant,
  productDetails,
  quantArray,
  itemCount,
  setItemCount,
  setProductList,
  totalPrice,
  setTotal,
}) => {
  const [showCart, setShowCart] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = (val) => {
    setOpen(val);
  };

  return (
    <header>
      <nav>
        <section className="left">
          <div className="imgs"></div>
          <div className="links hide-in-mobile">
            <ul></ul>
          </div>
        </section>
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
              <svg width="22" height="20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z"
                  fill="#69707D"
                  fillRule="nonzero"
                />
              </svg>
            </Badge>
          </IconButton>

          {showCart && (
            <Cart
              products={products}
              onOrderedQuant={onOrderedQuant}
              onReset={onReset}
              onShow={setShowCart}
              setOrderedQuant={setOrderedQuant}
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
      </nav>
    </header>
  );
};

const Cart = ({
  onOrderedQuant,
  onReset,
  onShow,
  products,
  setOrderedQuant,
  productDetails,
  quantArray,
  itemCount,
  setItemCount,
  setProductList,
  totalPrice,
  setTotal,
}) => {
  console.log("this is the product", productDetails); // Log the product
  return (
    <section className="cart">
      <div className="head">
        <p>Cart</p>
        <p style={{ marginLeft: "200px" }}>${totalPrice.toFixed(2)}</p>{" "}
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
                  onOrderedQuant={onOrderedQuant} // Pass quantity (if necessary)
                  onReset={onReset} // Reset function
                  products={product} // Pass the product details
                  setOrderedQuant={setOrderedQuant} // Function to set quantity
                  quantArray={quantArray}
                  PID={product._id} // Unique key for each product
                  itemCount={itemCount}
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
  onOrderedQuant,
  onReset,
  products,
  setOrderedQuant,
  quantArray,
  PID,
  itemCount,
  setItemCount,
  setProductList,
  setTotal,
}) => {
  const quant = quantArray.filter((item) => item.product === PID); // Use filter instead of findAll
  const quantity = quant.length > 0 ? quant[quant.length - 1] : undefined; // Access the last element safely
  console.log("qunatity", quantity);
  console.log("quant array", quantArray);
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
            {`$${products.price.toFixed(2)} x ${quantity.quantity}`}{" "}
          </span>
          <span> {`$${(products.price * quantity.quantity).toFixed(2)}`} </span>
        </div>
      </div>
      <IconButton
        className="delete-button"
        size="small"
        disableRipple
        onClick={() => {
          onReset();
          removeFromCart(products._id, setProductList, setItemCount, setTotal);
        }}
      >
        <TrashIcon /> {/* Use the TrashIcon component instead of the img tag */}
      </IconButton>
    </div>
  );
};

const Gallery = ({ products }) => {
  const [currentImage, setCurrentImage] = useState("");
  const [activeThumbnail, setActiveThumbnail] = useState(0); // Active thumbnail state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (products && products.imageUrl && products.imageUrl.length > 0) {
      setCurrentImage(products.imageUrl[0]);
      setActiveThumbnail(0); // Set the first thumbnail as active initially
    }
  }, [products]);

  const handleClick = (index) => {
    setActiveThumbnail(index); // Update active thumbnail index
    setCurrentImage(products.imageUrl[index]);
  };

  const handleToggle = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Determine the number of images to display (up to 4)
  const totalImages = products.imageUrl.length;
  const visibleThumbnailsCount = Math.min(totalImages, 4);

  // Create the circular array of thumbnails
  const circularThumbnails = Array.from(
    { length: visibleThumbnailsCount },
    (_, i) => {
      const index = (activeThumbnail + i) % totalImages;
      return products.imageUrl[index];
    }
  );

  return (
    <section className="gallery-holder hide-in-mobile">
      <section className="gallery">
        <div className="image">
          {currentImage && (
            <img
              src={`http://localhost:8000/${currentImage.substring(
                currentImage.indexOf("uploads/")
              )}`}
              alt={`${products.name}`}
              onClick={handleToggle}
              style={{ maxHeight: "520px", maxWidth: "520px" }}
            />
          )}
        </div>
        <BackdropGallery
          open={open}
          handleClose={handleClose}
          currentPassedImage={currentImage}
          products={products}
          updateMainImage={setCurrentImage} // Update main image when closing BackdropGallery
          setActiveThumbnail={setActiveThumbnail} // Update active thumbnail index
        />

        <div className="thumbnails">
          {circularThumbnails.map((imageUrl, i) => {
            const index = (activeThumbnail + i) % totalImages; // Actual index in products.imageUrl
            return (
              <div
                className="img-holder"
                key={index}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`outlay ${
                    index === activeThumbnail ? "activated" : ""
                  }`}
                ></div>
                <img
                  src={`http://localhost:8000/${imageUrl.substring(
                    imageUrl.indexOf("uploads/")
                  )}`}
                  alt={`${products.name}-${index + 1}`}
                  style={{
                    maxHeight: "70px",
                    maxWidth: "70px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
};

const BackdropGallery = ({
  open,
  handleClose,
  currentPassedImage,
  products,
  updateMainImage,
  setActiveThumbnail, // Pass setActiveThumbnail from parent
}) => {
  const [backdropImage, setBackdropImage] = useState(currentPassedImage);
  const [currentPassedImageIndex, setCurrentPassedImageIndex] = useState(1);

  useEffect(() => {
    if (products && products.imageUrl && products.imageUrl.length > 0) {
      const index = products.imageUrl.indexOf(currentPassedImage);
      setCurrentPassedImageIndex(index !== -1 ? index : 0);
      setBackdropImage(currentPassedImage || products.imageUrl[0]);
    }
  }, [currentPassedImage, products]);

  const handleClick = (index = null) => {
    if (products?.imageUrl?.length > 0 && index !== null) {
      setBackdropImage(products.imageUrl[index]);
      setCurrentPassedImageIndex(index);
    }
  };

  const handleIncrement = () => {
    if (products?.imageUrl?.length > 0) {
      const newIndex = (currentPassedImageIndex + 1) % products.imageUrl.length;
      setBackdropImage(products.imageUrl[newIndex]);
      setCurrentPassedImageIndex(newIndex);
    }
  };

  const handleDecrement = () => {
    if (products?.imageUrl?.length > 0) {
      const newIndex =
        (currentPassedImageIndex - 1 + products.imageUrl.length) %
        products.imageUrl.length;
      setBackdropImage(products.imageUrl[newIndex]);
      setCurrentPassedImageIndex(newIndex);
    }
  };

  const handleCloseWithUpdate = () => {
    const newActiveIndex = products.imageUrl.indexOf(backdropImage);
    updateMainImage(backdropImage);
    setActiveThumbnail(newActiveIndex); // Update the active thumbnail when closing
    handleClose();
  };

  // Get the 4 thumbnails around the current image index in a circular way
  const totalImages = products.imageUrl.length;
  const visibleThumbnailsCount = Math.min(totalImages, 4); // Up to 4 thumbnails
  const circularThumbnails = Array.from(
    { length: visibleThumbnailsCount },
    (_, i) => {
      const index = (currentPassedImageIndex + i) % totalImages;
      return products.imageUrl[index];
    }
  );

  return (
    <Backdrop
      className="backdrop"
      sx={{
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <section className="backdrop-content">
        <IconButton
          onClick={handleCloseWithUpdate}
          sx={{
            color: "#fff",
            bgcolor: "transparent",
            alignSelf: "flex-end",
          }}
        >
          <CloseIcon fillColor={"#fff"} />
        </IconButton>
        <div className="image">
          <IconButton
            className="icon-button-prev"
            disableRipple
            onClick={handleDecrement}
            sx={{
              height: "42px",
              width: "42px",
              bgcolor: "#fff",
            }}
          >
            <PreviousIcon />
          </IconButton>
          <IconButton
            className="icon-button-next"
            disableRipple
            onClick={handleIncrement}
            sx={{
              height: "42px",
              width: "42px",
              bgcolor: "#fff",
            }}
          >
            <NextIcon />
          </IconButton>
          <img
            src={
              backdropImage
                ? `http://localhost:8000/${backdropImage.substring(
                    backdropImage.indexOf("uploads/")
                  )}`
                : ""
            }
            alt="selected-product"
            style={{ cursor: "auto", maxHeight: "600px", maxWidth: "600px" }}
          />
        </div>
        <div className="thumbnails">
          {circularThumbnails.map((imageUrl, i) => {
            const index =
              (currentPassedImageIndex + i) % products.imageUrl.length; // Actual index in the products.imageUrl array
            return (
              <div
                className="img-holder-backd"
                key={index}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`outlay ${
                    index === currentPassedImageIndex ? "activated" : ""
                  }`}
                ></div>
                <img
                  src={`http://localhost:8000/${imageUrl.substring(
                    imageUrl.indexOf("uploads/")
                  )}`}
                  alt={`${products.name}-${index + 1}`}
                  style={{
                    maxHeight: "70px",
                    maxWidth: "70px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>
    </Backdrop>
  );
};

const QuantityButton = ({ onQuant, onRemove, onAdd }) => {
  return (
    <div className="amount">
      <button className="minus" onClick={onRemove} disabled={onQuant === 0}>
        <Minus />
      </button>

      <p>{onQuant}</p>
      <button className="plus" onClick={onAdd} disabled={onQuant === 100}>
        <Plus />
      </button>
    </div>
  );
}; //done
const Description = ({
  onQuant,
  onAdd,
  onRemove,
  onSetOrderedQuant,
  products,
  itemCount,
  setItemCount,
  setProductList,
  setTotal,
}) => {
  return (
    <section className="description">
      <p className="pre">Tripify company</p>
      <h1>{products.name}</h1>
      <p className="desc">{products.details}</p>
      <div className="price">
        <div className="main-tag">
          <p>{products.price} EGP</p>
        </div>
      </div>
      <div className="buttons">
        <QuantityButton onQuant={onQuant} onRemove={onRemove} onAdd={onAdd} />
        <button
          className="add-to-cart"
          onClick={() => {
            setItemCount(onQuant + itemCount);
            addToCart(
              products._id,
              onQuant,
              onSetOrderedQuant,
              setProductList,
              setTotal
            );
          }}
        >
          <CartIcon />
          add to cart
        </button>
      </div>
    </section>
  );
}; //done
export const fetchProducts = async (
  setProducts,
  setErrorMessage,
  productId
) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/access/seller/SearchProductById?id=${productId}`
    );

    setProducts(response.data); // Store product data
  } catch (error) {
    setErrorMessage("Error fetching product: " + error.message);
  }
};

export const addToCart = async (
  productId,
  quantity,
  setOrderedQuant,
  setProductList,
  setTotal
) => {
  try {
    const response = await axios.put(`http://localhost:8000/tourist/cart/add`, {
      productId,
      quantity,
      touristId: getUserId(),
    });
    console.log(response.data);
    const updatedCart = response.data.cart; // Backend returns updated cart
    setProductList(updatedCart.products);
    setTotal(updatedCart.totalPrice);

    // Find the product in the cart by productId
    const productInCart = updatedCart.products.find(
      (item) => item.product === productId
    );

    if (productInCart) {
      const updatedQuantity = productInCart.quantity; // Get the updated quantity for the product
      setOrderedQuant(updatedQuantity); // Update the ordered quantity
    }
  } catch (error) {
    console.error("Error adding product to cart: " + error.message);
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

function App() {
  const { productId } = useParams(); // Get productId from URL
  const [quant, setQuant] = useState(1);
  const [orderedQuant, setOrderedQuant] = useState(0);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [productList, setProductList] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [quantArray, setQuantArray] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts(setProducts, setErrorMessage, productId); // Pass state setters to fetchProducts
    getTouristCart(setProductList, setItemCount, setTotal);
  }, []);

  useEffect(() => {
    console.log("this is the product list", productList);
    fetchProductDetails(productList, setProductDetails, setQuantArray);
  }, [productList]);

  const addQuant = () => {
    setQuant(quant + 1);
  };

  const removeQuant = () => {
    setQuant(quant - 1);
  };

  const resetQuant = () => {
    setQuant(1);
    setOrderedQuant(0);
  };

  return (
    <main className="App">
      <Container component="section" maxWidth={"lg"}>
        {/* <Navbar
          onOrderedQuant={orderedQuant}
          onReset={resetQuant}
          products={products}
          setOrderedQuant={setOrderedQuant}
          productDetails={productDetails}
          quantArray={quantArray}
          itemCount={itemCount}
          setItemCount={setItemCount}
          setProductList={setProductList}
          totalPrice={total}
          setTotal={setTotal}
        /> */}

        <section className="core">
          {products.imageUrl && products.imageUrl.length > 0 ? (
            <Gallery products={products} />
          ) : (
            <p>No products available</p>
          )}

          <Description
            onQuant={quant}
            onAdd={addQuant}
            onRemove={removeQuant}
            onSetOrderedQuant={setOrderedQuant}
            products={products}
            itemCount={itemCount}
            setItemCount={setItemCount}
            setProductList={setProductList}
            setTotal={setTotal}
          />
        </section>
      </Container>
    </main>
  );
}

export default App;
