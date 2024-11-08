import Products from "./products.js";
import ProductsArchived from "./productsArchived.js";
import { getUserType } from "../../utils/authUtils.js";
import { useState } from "react";
import Fab from "@mui/material/Fab";
import { Box } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const ProductsLists = () => {
  const [toggle, setToggle] = useState(true);
  console.log(getUserType());

  return (
    <>
      {toggle ? <Products /> : <ProductsArchived />}

      {/* Positioning button on the bottom-right */}
      {getUserType() !== "Tourist" ? (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <Fab color="primary" aria-label="toggle" onClick={() => setToggle(!toggle)}>
            <SwapHorizIcon />
          </Fab>
        </Box>
      ) : null}
    </>
  );
};

export default ProductsLists;
