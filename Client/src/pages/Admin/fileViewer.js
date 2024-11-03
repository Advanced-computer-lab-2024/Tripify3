import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const FileViewer = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const location = useLocation();
  const { files } = location.state; // Get files from React Router state
  const navigate = useNavigate(); // To navigate back to the previous page

  useEffect(() => {
    if (files.length > 0) {
      setLoading(false);
      setSelectedFileUrl(files[0].url); // Load the first file by default
    }
  }, [files]);

  const handleFileChange = (url) => {
    setSelectedFileUrl(url);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate("/admin/users")} sx={{ mb: 2 }}>
        Go Back
      </Button>
      {/* <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        File Viewer
      </Typography> */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Box sx={{ mb: 4 }}>
            {files.map((file, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleFileChange(file.url)}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: selectedFileUrl === file.url ? "orange" : "primary.main",
                  color: selectedFileUrl === file.url ? "darkblue" : "white",
                  "&:hover": {
                    backgroundColor: selectedFileUrl === file.url ? "darkorange" : "primary.dark",
                  },
                }}
              >
                {file.filename}
              </Button>
            ))}
          </Box>
          {selectedFileUrl && (
            <iframe
              src={selectedFileUrl}
              width="100%"
              height="900px" // Increased height for better visibility
              title="File Viewer"
              frameBorder="0"
            />
          )}
        </div>
      )}
    </Box>
  );
};

export default FileViewer;
