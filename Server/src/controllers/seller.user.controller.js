import seller from "../models/users.js"; // Adjust the path as necessary
import product from "../models/product.js"; // Adjust the path as necessary

// Seller
export const getSellers = async (req, res) => {
  try {
    // Retrieve all users with the type 'seller' from the database
    const sellers = await seller.find({ type: "seller" });
    res.status(200).json(sellers); // Send the sellers data as JSON response
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server Error", error });
  }
};
export const signup = async (req, res) => {
  try {
    const { name, email, description, username, password } = req.body;

    const existingUser = await seller.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const existingEmail = await seller.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const type = "seller";
    const newseller = new seller({
      name,
      username,
      email,
      password,
      type,
      details: {
        description,
      },
    });

    // Save the user to the database
    await newseller.save();

    // Respond with success message and user data
    res
      .status(201)
      .json({ message: "User created successfully", user: newseller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const viewSeller = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await seller.find({ username, type: "seller" });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const updateSeller = async (req, res) => {
  const { username, name, description } = req.body; // Expecting the username in the request body

  try {
    const user = await seller.findOneAndUpdate(
      { username: username }, // Search by username
      { name: name, "details.description": description }, // Fields to update
      { new: true } // Return the updated document
    );
    if (!user) {
      return res.status(404).json({ message: "Seller not found." });
    }
    if (user.type !== "seller") {
      return res.status(400).json({ message: "User is not a seller." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Product

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      details,
      quantity,
      rating,
      imageUrl,
      category,
      sellerId,
    } = req.body;

    // Check if the product already exists
    const existingProduct = await product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists." });
    }

    const productRating = rating ? rating : 0; // Set rating to 0 if not provided

    // Validate if the sellerId refers to a valid seller
    const sellerUser = await seller.findById(sellerId);
    if (!sellerUser || sellerUser.type !== "seller") {
      return res.status(400).json({ message: "Invalid seller." });
    }

    // Create a new product instance
    const newProduct = new product({
      name,
      price,
      details,
      rating: productRating,
      quantity,
      imageUrl,
      category,
      sellerId,
      sales: 0, // Initialize sales to 0
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with success message and product data
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const searchAllProducts = async (req, res) => {
  try {
    // Find products by name
    const product2 = await product.find({}); // Using regex for case-insensitive search
    // Return the found product(s)
    return res.status(200).json(product2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const editProduct = async (req, res) => {
  const {
    name,
    price,
    details,
    quantity,
    rating,
    imageUrl,
    category,
    sellerId,
  } = req.body;

  try {
    // Validate if the sellerId refers to a valid seller (if sellerId is provided)
    if (sellerId) {
      const sellerUser = await seller.findById(sellerId);
      if (!sellerUser || sellerUser.type !== "seller") {
        return res.status(400).json({ message: "Invalid seller." });
      }
    }

    // Find and update the product by name
    const product2 = await product.findOneAndUpdate(
      { name: name }, // Search by name
      { price, details, quantity, rating, imageUrl, category, sellerId }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!product2) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product2);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const searchProduct = async (req, res) => {
  try {
    const { name } = req.body;

    // Find products by name
    const product2 = await product.find({ name: new RegExp(name, "i") }); // Using regex for case-insensitive search

    // If no product is found
    if (product2.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Return the found product(s)
    return res.status(200).json(product2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  const { name } = req.body;

  try {
    // Attempt to delete the product
    const result = await product.deleteOne({ name });

    // Check if the product was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // If deleted successfully, send response
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const filterProduct = async (req, res) => {
  try {
    const { minPrice, maxPrice, greaterThan, lessThan, equal, notEqual } =
      req.body;

    // Build the price query dynamically based on the provided conditions
    let priceQuery = {};

    // Check if a price range (minPrice and maxPrice) is provided
    if (minPrice !== undefined && maxPrice !== undefined) {
      priceQuery.$gte = minPrice; // Greater than or equal to minPrice
      priceQuery.$lte = maxPrice; // Less than or equal to maxPrice
    }

    // Handle greater than condition
    else if (greaterThan !== undefined) {
      priceQuery.$gt = greaterThan; // Greater than the specified price
    }

    // Handle less than condition
    else if (lessThan !== undefined) {
      priceQuery.$lt = lessThan; // Less than the specified price
    }

    // Handle equal to condition
    else if (equal !== undefined) {
      priceQuery = { price: equal }; // Equal to the specified price
    }

    // Handle not equal to condition
    else if (notEqual !== undefined) {
      priceQuery = { price: { $ne: notEqual } }; // Not equal to the specified price
    }
    // Find products based on the constructed price query
    const products = await product.find({ price: priceQuery });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the criteria." });
    }

    // Return the filtered products
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const filterProductCondition = async (req, res) => {
  try {
    const { priceCondition } = req.body; // Expecting something like "price<=10" or "price>=5 and price<=10"

    // Ensure that the price condition is provided
    if (!priceCondition) {
      return res.status(400).json({ message: "Price condition is required." });
    }

    // Initialize an empty price query object
    let priceQuery = {};

    // Split conditions if there are multiple (e.g., "price>=5 and price<=10")
    const conditions = priceCondition.split(" and ");

    conditions.forEach((condition) => {
      // Match operators in each condition
      const operatorMatch = condition.match(/(<=|>=|<|>|==|!=)/);
      if (!operatorMatch) {
        return res
          .status(400)
          .json({ message: `Invalid price condition format: ${condition}` });
      }

      // Extract the operator and value
      const operator = operatorMatch[0];
      const value = parseFloat(condition.split(operator)[1]);

      // Ensure the value is a valid number
      if (isNaN(value)) {
        return res
          .status(400)
          .json({ message: `Invalid price value in condition: ${condition}` });
      }

      // Build the query based on the operator
      switch (operator) {
        case "<=":
          priceQuery.$lte = value; // Less than or equal to
          break;
        case ">=":
          priceQuery.$gte = value; // Greater than or equal to
          break;
        case "<":
          priceQuery.$lt = value; // Less than
          break;
        case ">":
          priceQuery.$gt = value; // Greater than
          break;
        case "==":
          priceQuery = { price: value }; // Equal to
          break;
        case "!=":
          priceQuery = { price: { $ne: value } }; // Not equal to
          break;
        default:
          return res.status(400).json({ message: "Unsupported operator." });
      }
    });

    // Find products based on the constructed price query
    const products = await product.find({ price: priceQuery });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the price condition." });
    }

    // Return the filtered products
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const sortByRating = async (req, res) => {
  const { sortBy } = req.body;

  try {
    const sortOrder = sortBy === "asc" ? 1 : -1;
    const products = await product.find({}).sort({ rating: sortOrder });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAllProducts = async (req, res) => {
  try {
    // Delete all products from the database
    await product.deleteMany({});
    res.status(200).json({ message: "All products deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
