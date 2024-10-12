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

export const createTag = async (req, res) => {
  const { name } = req.body;

  try {
    // Validate that the tag name is at least 3 letters long
    if (!name || name.length < 3) {
      return res.status(400).json({ message: "Tag name must be at least 3 letters long." });
    }

    // Check if the tag already exists
    const existingTag = await Tag.findOne({ name });

    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists." });
    }

    // If not, create a new tag
    const newTag = await Tag.create({ name });
    res.status(201).json({ message: "Tag created successfully.", newTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateTag = async (req, res) => {
  const { oldName, newName } = req.body;
  console.log(req.body);

  try {
    // Check if the new name is less than 3 characters
    if (newName.length < 3) {
      return res.status(400).json({ message: "New name must be at least 3 characters long." });
    }

    // Check if the old name is the same as the new name
    if (oldName === newName) {
      return res.status(400).json({ message: "Old name cannot be the same as the new name." });
    }

    // Check if the tag with the oldName exists
    const existingTag = await Tag.findOne({ name: oldName });

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found." });
    }

    // Update the tag if it exists
    const updatedTag = await Tag.findOneAndUpdate(
      { name: oldName }, 
      { name: newName }, 
      { new: true }
    );
    res.status(200).json({ message: "Tag updated successfully", updatedTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;  
  console.log(req.params);
  

  try {
    // Check if the tag exists
    const existingTag = await Tag.findById(id);

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // If it exists, delete the tag
    const deletedTag = await Tag.findByIdAndDelete(id);
    res.status(200).json({ message: "Tag deleted successfully", deletedTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
