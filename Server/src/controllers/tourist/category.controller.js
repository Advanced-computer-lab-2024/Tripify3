import Category from "../../models/product.js";



export const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find(); // Fetch all categories
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  };