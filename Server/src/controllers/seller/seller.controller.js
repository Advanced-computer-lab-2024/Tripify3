import seller from "../../models/seller.js"; // Adjust the path as necessary
import product from "../../models/product.js"; // Adjust the path as necessary
import users from "../../models/user.js";
import { sendEmailNotification } from "../../middlewares/sendEmailOutOfstock.js"; // Adjust the path as necessary
// Seller
export const getSellers = async (req, res) => {
  try {
    // Retrieve all users with the type 'seller' from the database
    const sellers = await seller.find({});
    res.status(200).json(sellers); // Send the sellers data as JSON response
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Server Error", error });
  }
};
export const signup = async (req, res) => {
  try {
    const { name, email, description, username, password } = req.body;

    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const existingEmail = await users.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const type = "seller";
    const newseller = new seller({
      username,
      name,
      email,
      password,
      type: "Seller",
      description,
    });

    // Save the user to the database
    await newseller.save();
    // Respond with success message and user data
    res.status(201).json({
      message: "User created successfully",
      user: newseller,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//DONE IN FRONTEND
export const viewSeller = async (req, res) => {
  try {
    const { username } = req.query; // Get the username from query parameters
    const user = await seller.findOne({ username }).select("-__t -__v"); // Find the user by username and type 'seller'
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
  const { username, name, description } = req.body; // Expecting the us in the request body

  try {
    const user = await seller
      .findOneAndUpdate(
        { username: username }, // Search by username
        { name: name, description: description }, // Fields to update
        { new: true } // Return the updated document
      )
      .select("-__t -__v");
    if (!user) {
      return res.status(404).json({ message: "Seller not found." });
    }
    if (user.type !== "Seller") {
      return res.status(400).json({ message: "User is not a seller." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllSellers = async (req, res) => {
  try {
    // Delete all sellers from the database
    await seller.deleteMany({});
    res.status(200).json({ message: "All sellers deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//Product
//need to change (check if the product is archived or not)
export const createProduct = async (req, res) => {
  try {
    const { name, price, details, quantity, imageUrl, category, sellerId } =
      req.body;

    // Check if the product already exists
    const existingProduct = await product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists." });
    }

    // Validate if the sellerId refers to a valid seller
    const sellerUser = await seller.findById(sellerId);
    if (!sellerUser || sellerUser.type !== "seller") {
      return res.status(400).json({ message: "Invalid seller." });
    }

    // Create a new product instance, ensure imageUrl is an array
    const newProduct = new product({
      name,
      price,
      details,
      rating: 0,
      quantity,
      category,
      sellerId,
      sales: 0, // Initialize sales to 0
      // Ensure imageUrl is an array
    });
    // Check if imageUrl is provided, otherwise assign a default or leave it empty
    if (imageUrl && imageUrl.length > 0) {
      newProduct.imageUrl = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
    } else {
      newProduct.imageUrl = []; // Set empty array or use a default placeholder URL
    }

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
//need to change in FE to loop over the images need to be changed
export const searchAllProducts = async (req, res) => {
  try {
    // Find products by name
    const product2 = await product.find({ archived: false }); // Using regex for case-insensitive search
    // Return the found product(s)
    return res.status(200).json(product2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const searchAllArchivedProducts = async (req, res) => {
  try {
    // Find products by name
    const product2 = await product.find({ archived: true }); // Using regex for case-insensitive search
    // Return the found product(s)
    return res.status(200).json(product2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const editProduct = async (req, res) => {
  const { name, price, details, quantity, imageUrl, category, sellerId } =
    req.body;

  try {
    // Validate if the sellerId refers to a valid seller (if sellerId is provided)
    const current = await product.findOne({ name: name });

    if (!current) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!current.sellerId.equals(sellerId)) {
      return res.status(400).json({ message: "This seller is not the owner." });
    }

    // Find and update the product by name
    const updatedProduct = await product.findOneAndUpdate(
      { name: name, sellerId: sellerId }, // Query to find the product by name and sellerId
      {
        price,
        details,
        quantity,
        // If the product has existing images, push the new one, otherwise, create an array with the new one
        imageUrl,
        // $push: { imageUrl: imageUrl }, // Pushing new image to the existing array
        category,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; // Search by name need to be changed

export const searchProduct = async (req, res) => {
  try {
    const { name } = req.query; // Extracting name from the query parameter

    // Find product by name using case-insensitive exact match
    const product2 = await product.find({
      name: { $regex: `^${name}$`, $options: "i" },
    });

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
  const { name } = req.query;
  console.log(name);

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
export const filterProductCondition = async (req, res) => {
  try {
    const { priceCondition } = req.query; // Expecting something like "price<=10" or "price>=5 and price<=10"
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
  const { sortBy } = req.query;
  console.log(sortBy);

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
//dont know whether to search with name or id
export const addProdImage2 = async (req, res) => {
  const { id, imageUrl } = req.body;
  try {
    // Check if imageUrl is provided
    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Find the product by id and update the imageUrl
    const updatedProduct = await product.findById(id);
    console.log(updatedProduct);
    // Check if product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    updatedProduct.imageUrl.push(imageUrl);
    await updatedProduct.save();
    return res.status(200).json({
      message: "Image added successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const viewProductStockAndSales = async (req, res) => {
  try {
    // Retrieve all products with quantity and sales
    const products = await product.find({}, "name quantity sales price");

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the products with relevant fields
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//dont know whether to search with name or id
export const archiveProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const product2 = await product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: true }, // Update the "archived" field to true
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
export const unarchiveProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const product2 = await product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: false }, // Update the "archived" field to true
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

export const decrementProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product3 = await product.findById(productId);
    if (!product3) {
      return res.status(404).json({ message: "Product not found" });
    }
    //will not be able to see this as the list returns only non archived products
    if (product3.archived) {
      return res.status(400).json({ message: "Product is archived" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    if (product3.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds available stock" });
    }
    const product2 = await product.findByIdAndUpdate(
      productId,
      {
        quantity: product3.quantity - quantity,
        sales: product3.sales + quantity,
        $push: { salesHistory: { quantity: quantity, date: Date.now() } },
      }, // decrement quantity and increment sales
      { new: true }
    );

    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product2.quantity <= 0) {
      const emailRecipient = await seller.findById(product2.sellerId);
      if (emailRecipient)
        await sendEmailNotification(emailRecipient.email, product2.name); // Send email notification to the seller
      // Send email notification to the admin too
    }

    res.status(200).json(product2);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//sprint 3
export const filterSalesReport2 = async (req, res) => {
  const {
    productId,
    date,
    month,
    year,
    greaterThan,
    greaterThanOrEqual,
    lessThan,
    lessThanOrEqual,
    greaterThanMonth,
    greaterThanMonthOrEqual,
    lessThanMonth,
    lessThanMonthOrEqual,
    exactMonth,
  } = req.query;

  try {
    console.log("ProductId:", productId);
    const productRepo = await product.findById(productId); // Correct capitalization for the model
    if (!productRepo) {
      return res.status(404).json({ message: "Product not found." });
    }

    const salesHistory = productRepo.salesHistory;
    if (salesHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales report found for the given criteria" });
    }

    let filteredSales = salesHistory;

    // Exact date filtering
    if (date) {
      filteredSales = filteredSales.filter(
        (sale) =>
          new Date(sale.date).toDateString() === new Date(date).toDateString()
      );
    }

    // Exact month and year filtering
    if (month && year) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getMonth() + 1 === month && // Months are 0-based, so we add 1
          saleDate.getFullYear() === year
        );
      });
    }
    if (exactMonth) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.getMonth() + 1; // Month is zero-based, so add 1
        return saleMonth === exactMonth;
      });
    }

    // Greater than month
    if (greaterThanMonth) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.getMonth() + 1;
        return saleMonth > greaterThanMonth;
      });
    }

    // Greater than or equal to month
    if (greaterThanMonthOrEqual) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.getMonth() + 1;
        return saleMonth >= greaterThanMonthOrEqual;
      });
    }

    // Less than month
    if (lessThanMonth) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.getMonth() + 1;
        return saleMonth < lessThanMonth;
      });
    }

    // Less than or equal to month
    if (lessThanMonthOrEqual) {
      filteredSales = filteredSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const saleMonth = saleDate.getMonth() + 1;
        return saleMonth <= lessThanMonthOrEqual;
      });
    }
    //________________________________________________________________________________________
    //________________________________________________________________________________________
    // Greater than date
    if (greaterThan) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) > new Date(greaterThan)
      );
    }

    // Greater than or equal to date
    if (greaterThanOrEqual) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) >= new Date(greaterThanOrEqual)
      );
    }

    // Less than date
    if (lessThan) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) < new Date(lessThan)
      );
    }

    // Less than or equal to date
    if (lessThanOrEqual) {
      filteredSales = filteredSales.filter(
        (sale) => new Date(sale.date) <= new Date(lessThanOrEqual)
      );
    }

    if (filteredSales.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales report found for the given criteria" });
    }
    const sortedSales = filteredSales.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    if (year) {
      const byYear = sortedSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate.getFullYear() === year; // Make sure to return the comparison result
      });
      return res.status(200).json({
        productName: productRepo.name,
        filteredSales: byYear,
      });
    }
    res.status(200).json({
      productName: productRepo.name,
      filteredSales: sortedSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const addProdImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.body;

    if (!id || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Product ID and Image are required" });
    }

    const product2 = await product.findById(id);
    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the imageUrl is a valid Base64 string
    // const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;
    // if (!base64Regex.test(imageUrl)) {
    //   return res.status(400).json({ message: "Invalid Base64 image format" });
    // }

    product2.imageUrl.push(imageUrl); // Add the Base64 image string to the array
    await product2.save();

    res.status(200).json({ message: "Image added successfully", product2 });
  } catch (error) {
    console.error("Error adding image:", error);
    res
      .status(500)
      .json({ message: "Error adding image", error: error.message });
  }
};
export const getSalesHistory = async (req, res) => {
  try {
    const { name } = req.query;
    const product2 = await product.findOne({ name });
    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product2.salesHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
