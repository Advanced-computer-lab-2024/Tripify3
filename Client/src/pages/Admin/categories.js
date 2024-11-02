import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, Edit } from "@mui/icons-material";
import { getAllCategories, createCategory, deleteCategory, editCategory } from "../../services/admin.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f", // Dark blue
    },
    secondary: {
      main: "#ff6f00", // Orange
    },
  },
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false); // State for the add category dialog
  const [addCategoryError, setAddCategoryError] = useState(""); // State for error message when adding category

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log(response.data);
        
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      alert("Category name is required");
      return;
    }

    try {
      const response = await createCategory({ name: newCategoryName });
      setCategories([...categories, response.data.newcategory]);
      setNewCategoryName("");
      setOpenAddCategoryDialog(false); // Close the dialog after adding the category
      setAddCategoryError(""); // Reset error message
    } catch (error) {
      if (error.response?.status === 400) {
        setAddCategoryError("Category name already exists.");
      } else {
        alert("Error creating category");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory({ name: categories.find((cat) => cat._id === id)?.name });
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      alert("Error deleting category");
    }
  };

  const handleOpenEditDialog = (category) => {
    setSelectedCategory({ ...category, oldName: category.name, newName: category.name });
    setOpenEditDialog(true);
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !selectedCategory.newName) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      await editCategory({ oldName: selectedCategory.oldName, newName: selectedCategory.newName });
      setCategories(categories.map((category) => (category._id === selectedCategory._id ? { ...category, name: selectedCategory.newName } : category)));
      setOpenEditDialog(false);
    } catch (error) {
      alert("Error updating category");
    }
  };

   const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              Manage Categories
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Search Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ height: '56px', mr: 2 }} 
            >
              Search
            </Button>
            <TextField
              label="Search categories"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: "300px", mr: 2 }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddCategoryDialog(true)} // Open the add category dialog
            color="primary"
          >
            Add Category
          </Button>
        </Box>

        {/* Categories List */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} md={6} key={category._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    {category.name}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleOpenEditDialog(category)} color="primary" sx={{ mr: 2 }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              variant="outlined"
              value={selectedCategory?.newName || ""}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, newName: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCategory} color="primary" variant="contained">
              Save
            </Button>
            <Button onClick={() => setOpenEditDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={openAddCategoryDialog} onClose={() => setOpenAddCategoryDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            {addCategoryError && <Typography color="error">{addCategoryError}</Typography>} {/* Display error message */}
            <TextField
              label="Category Name"
              variant="outlined"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddCategory} color="primary" variant="contained">
              Add
            </Button>
            <Button onClick={() => setOpenAddCategoryDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Categories;
