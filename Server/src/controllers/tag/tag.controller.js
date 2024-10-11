import Tag from "../../models/tag.js";

export const getTags = async (req, res) => {
    try {
      const tags = await Tag.find(); // Fetch all tags from the database
      res.status(200).json({
        message: "Tags retrieved successfully",
        tags: tags,
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving tags", error: error.message });
    }
  };
  