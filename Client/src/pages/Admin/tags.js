import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Button, Card, CardContent, Typography, TextField, IconButton, CircularProgress, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, Edit } from "@mui/icons-material";
import { getAllTags, createTag, deleteTag, editTag } from "../../services/admin.js"; // Import the necessary functions

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
    } catch (error) {
      alert("Error creating tag");
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
    setSelectedTag({ ...tag, oldName: tag.name, newName: tag.name }); // Set both oldName and newName
    setOpenEditDialog(true);
  };

  const handleEditTag = async () => {
    if (!selectedTag || !selectedTag.newName) {
      alert("Tag name cannot be empty");
      return;
    }

    try {
      // Make sure you're sending the correct `oldName` and `newName`
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

        {/* Search and Add Tag Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <TextField label="Search tags" variant="outlined" value={searchTerm} onChange={handleSearchChange} sx={{ width: "300px", mr: 2 }} />
          <TextField label="Add new tag" variant="outlined" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} sx={{ width: "300px", mr: 2 }} />
          <Button variant="contained" onClick={handleAddTag} color="primary">
            Add Tag
          </Button>
        </Box>

        {/* Tags List */}
        <Grid container spacing={3}>
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
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogContent>
            <TextField
              label="Tag Name"
              variant="outlined"
              value={selectedTag?.newName || ""} // Bind this to newName
              onChange={(e) => setSelectedTag({ ...selectedTag, newName: e.target.value })} // Update newName on change
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
      </Box>
    </ThemeProvider>
  );
};

export default Tags;
