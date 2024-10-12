import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

const FileViewer = ({ open, onClose, fileUrls }) => {
  const [loading, setLoading] = useState(true);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  useEffect(() => {
    if (fileUrls.length > 0) {
      setLoading(false);
      setSelectedFileUrl(fileUrls[0].url); // Load the first file by default
    }
  }, [fileUrls]);

  const handleFileChange = (url) => {
    setSelectedFileUrl(url);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"> {/* Increased maxWidth */}
      <DialogTitle>
        View Uploaded Files
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }} // Positioning the close button
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              {fileUrls.map((file, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() => handleFileChange(file.url)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor: selectedFileUrl === file.url ? 'orange' : 'primary.main', // Highlight selected button
                    color: selectedFileUrl === file.url ? 'darkblue' : 'white', // Change text color for selected button
                    '&:hover': {
                      backgroundColor: selectedFileUrl === file.url ? 'darkorange' : 'primary.dark', // Change hover effect for selected button
                    },
                  }}
                >
                  {file.filename}
                </Button>
              ))}
            </div>
            {selectedFileUrl && (
              <iframe
                src={selectedFileUrl}
                width="100%"
                height="600px" // Increased height for better visibility
                title="File Viewer"
                frameBorder="0"
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;
