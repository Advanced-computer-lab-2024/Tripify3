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
import { getAllTags, createTag, deleteTag, editTag } from "../../services/admin.js";

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

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false); // State for the add tag dialog
  const [addTagError, setAddTagError] = useState(""); // State for error message when adding tag

  // Fetch tags when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setTags(response.data.tags);
        setLoading(false);
      } catch (error) {
        setError("Error fetching tags");
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTag = async () => {
    if (!newTagName) {
      alert("Tag name is required");
      return;
    }

    try {
      const response = await createTag({ name: newTagName });
      setTags([...tags, response.data.newTag]);
      setNewTagName("");
      setOpenAddTagDialog(false); // Close the dialog after adding the tag
      setAddTagError(""); // Reset error message
    } catch (error) {
      if (error.response?.status === 400) {
        setAddTagError("Tag name already exists.");
      } else {
        alert("Error creating tag");
      }
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await deleteTag(id);
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (error) {
      alert("Error deleting tag");
    }
  };

  const handleOpenEditDialog = (tag) => {
    setSelectedTag({ ...tag, oldName: tag.name, newName: tag.name });
    setOpenEditDialog(true);
  };

  const handleEditTag = async () => {
    if (!selectedTag || !selectedTag.newName) {
      alert("Tag name cannot be empty");
      return;
    }

    try {
      await editTag({ oldName: selectedTag.oldName, newName: selectedTag.newName });
      setTags(tags.map((tag) => (tag._id === selectedTag._id ? { ...tag, name: selectedTag.newName } : tag)));
      setOpenEditDialog(false);
    } catch (error) {
      alert("Error updating tag");
    }
  };

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
              Manage Tags
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
              label="Search tags"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: "300px", mr: 2 }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddTagDialog(true)} // Open the add tag dialog
            color="primary"
          >
            Add Tag
          </Button>
        </Box>

        {/* Tags List */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {filteredTags.map((tag) => (
            <Grid item xs={12} md={6} key={tag._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    {tag.name}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleOpenEditDialog(tag)} color="primary" sx={{ mr: 2 }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTag(tag._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogContent>
            <TextField
              label="Tag Name"
              variant="outlined"
              value={selectedTag?.newName || ""}
              onChange={(e) => setSelectedTag({ ...selectedTag, newName: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditTag} color="primary" variant="contained">
              Save
            </Button>
            <Button onClick={() => setOpenEditDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Tag Dialog */}
        <Dialog open={openAddTagDialog} onClose={() => setOpenAddTagDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Tag</DialogTitle>
          <DialogContent>
            {addTagError && <Typography color="error">{addTagError}</Typography>} {/* Display error message */}
            <TextField
              label="Tag Name"
              variant="outlined"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddTag} color="primary" variant="contained">
              Add
            </Button>
            <Button onClick={() => setOpenAddTagDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Tags;
