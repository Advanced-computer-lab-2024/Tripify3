import Tourist from "../../models/tourist.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";

export const initializeCart = async (req, res) => {
  try {
    const { id } = req.body; // Assuming `id` is the tourist's ID

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the tourist already has a cart (if necessary)
    const existingCart = await Cart.findOne({ user: id });
    if (existingCart) {
      return res.status(400).json({ message: "Cart already exists for this tourist" });
    }

    // Create a new cart for the tourist
    const newCart = new Cart({
      user: tourist._id, // Associate the tourist with the cart
      products: [],
      totalPrice: 0,
    });

    // Save the new cart
    await newCart.save();

    // Return the created cart details (optional)
    res.status(201).json({
      message: "Cart initialized successfully",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error initializing cart:", error);
    res.status(500).json({ message: "Failed to initialize cart" });
  }
};

export const addToCart = async (req, res) => {
  const { touristId, productId, quantity = 1 } = req.body; // Default quantity is 1 if not provided

  try {
    // Find the tourist by ID and populate their cart
    const tourist = await Tourist.findById(touristId).populate("cart");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    let cart = tourist.cart;
    if (!cart) {
      // If the cart is not initialized, create a new one
      cart = new Cart({
        user: tourist._id,
        products: [],
        totalPrice: 0,
        itemCount: 0, // Initialize itemCount to 0
      });

      // Save the new cart
      await cart.save();

      // Associate the new cart with the tourist
      tourist.cart = cart._id;
      await tourist.save(); // Save the tourist with the updated cart reference

    }

    // Fetch the product details (assuming you have a Product model)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: `Requested quantity is not available. Only ${product.quantity} item(s) left in stock.`,
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === productId);

    if (existingProductIndex > -1) {
      // If the product already exists in the cart, increase the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product does not exist in the cart, add it with the specified quantity
      cart.products.push({ product: productId, quantity: quantity });
    }

    // Update itemCount and totalPrice
    cart.itemCount += quantity;
    cart.totalPrice += quantity * product.price; // Add the product price multiplied by the quantity

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

export const getTouristCart = async (req, res) => {
  const { touristId } = req.query; // Changed from req.params to req.query

  try {
    let touristData = await Tourist.findById(touristId).populate("cart");

    // Check if the tourist has a cart, and initialize if not
    if (!touristData.cart) {
      const newCart = new Cart({
        user: touristId,
        products: [],
        totalPrice: 0,
      });
      await newCart.save();

      // Associate the new cart with the tourist and save
      touristData.cart = newCart._id;
      await touristData.save();
      touristData = await Tourist.findById(touristId).populate("cart"); // Re-fetch tourist with populated cart
    }

    res.status(200).json(touristData.cart);
  } catch (error) {
    console.error("Error fetching tourist cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { touristId, productId } = req.body;

  try {
    // Find the tourist and populate their cart
    let touristData = await Tourist.findById(touristId).populate("cart");

    if (!touristData || !touristData.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the cart associated with the tourist
    const cart = await Cart.findById(touristData.cart._id);

    // Find the product you are going to remove in the cart
    const productToRemove = cart.products.find((product) => product.product.toString() === productId);

    if (productToRemove) {
      // Fetch the product details (assuming you have a Product model)
      const productDetails = await Product.findById(productId);
      if (!productDetails) {
        return res.status(404).json({ message: "Product not found in the database" });
      }

      // Subtract the quantity of the product being removed from itemCount
      cart.itemCount -= productToRemove.quantity;
      cart.totalPrice -= productToRemove.quantity * productDetails.price; // Use productDetails.price

      // Filter out the product from the cart
      cart.products = cart.products.filter((product) => product.product.toString() !== productId);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

export const Decrementor = async (req, res) => {
  const { touristId, productId } = req.body;

  try {
    // Find the tourist and populate their cart
    let touristData = await Tourist.findById(touristId).populate("cart");

    if (!touristData || !touristData.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the cart associated with the tourist
    const cart = await Cart.findById(touristData.cart._id);

    // Find the product in the cart
    const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Fetch the product details (assuming you have a Product model)
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
      return res.status(404).json({ message: "Product not found in the database" });
    }

    // Decrement the quantity of the product in the cart
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      // If the quantity is 1 or less, remove the product from the cart
      cart.products.splice(productIndex, 1);
    }

    // Subtract the product price from the totalPrice
    cart.totalPrice -= productDetails.price;
    cart.itemCount -= 1;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product updated in cart", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const updateCart2 = async (req, res) => {
  const { touristId, productId, number } = req.body; // 'number' can be positive (add/increment) or negative (decrement/remove)

  try {
    // Find the tourist and populate their cart
    let tourist = await Tourist.findById(touristId).populate("cart");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    let cart = tourist.cart;

    // If the tourist doesn't have a cart, create one
    if (!cart) {
      cart = new Cart({
        user: tourist._id,
        products: [],
        totalPrice: 0,
      });

      // Save the new cart
      await cart.save();

      // Associate the new cart with the tourist
      tourist.cart = cart._id;
      await tourist.save();
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

    // If product is found in the cart
    if (productIndex > -1) {
      // Increment or decrement the quantity based on 'number'
      cart.products[productIndex].quantity = number;
      if (cart.products[productIndex].quantity < 1) {
        cart.products.splice(productIndex, 1);
      }

      // If the quantity goes below 1, remove the product from the cart
      if (cart.products[productIndex].quantity < 1) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      // If product is not found in the cart, and 'number' is positive, add it
      if (number > 0) {
        cart.products.push({ product: productId, quantity: number });
      } else {
        // If 'number' is negative and product doesn't exist, nothing to decrement
        return res.status(400).json({ message: "Cannot decrement a non-existent product" });
      }
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const updateCart = async (req, res) => {
  const { touristId, productId, number } = req.body; // 'number' is the new quantity

  try {
    // Find the tourist and populate their cart
    let tourist = await Tourist.findById(touristId).populate("cart");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    let cart = tourist.cart;

    // If the tourist doesn't have a cart, create one
    if (!cart) {
      cart = new Cart({
        user: tourist._id,
        products: [],
        totalPrice: 0,
      });

      // Save the new cart
      await cart.save();

      // Associate the new cart with the tourist
      tourist.cart = cart._id;
      await tourist.save();
    }

    // Fetch the product details (assuming you have a Product model)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

     // Check if the requested quantity is available
     if (product.quantity < number) {
      return res.status(400).json({
        message: `Requested quantity is not available. Only ${product.quantity} item(s) left in stock.`,
      });
    }


    // Find the product in the cart
    const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

    // Calculate the old quantity
    const oldQuantity = productIndex > -1 ? cart.products[productIndex].quantity : 0;

    // Calculate the price difference
    const priceDifference = product.price * (number - oldQuantity);

    cart.itemCount += number - oldQuantity;
    // If product is found in the cart
    if (productIndex > -1) {
      // Update the quantity in the cart
      cart.products[productIndex].quantity = number;

      // If the quantity is less than 1, remove the product
      if (cart.products[productIndex].quantity < 1) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      // If product is not found in the cart, and 'number' is positive, add it
      if (number > 0) {
        cart.products.push({ product: productId, quantity: number });
      } else {
        // If 'number' is negative or zero and product doesn't exist, return an error
        return res.status(400).json({ message: "Cannot decrement a non-existent product" });
      }
    }

    // Update the total price
    cart.totalPrice += priceDifference;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};
