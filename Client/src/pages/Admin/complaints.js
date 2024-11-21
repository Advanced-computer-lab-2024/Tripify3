import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, CircularProgress
} from '@mui/material';
import { getAllComplaints, putComplaintStatus, postComplaintReply } from '../../services/admin.js'; // Adjust import paths
import dayjs from 'dayjs';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTouristId, setSelectedTouristId] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [replyComment, setReplyComment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints();
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleSortDate = () => {
    const sortedComplaints = [...complaints].sort((a, b) => {
      return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });
    setComplaints(sortedComplaints);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterStatus = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    try {
      await putComplaintStatus(id, newStatus);
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status: newStatus } : complaint
        )
      );
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setSortOrder('desc');
    fetchComplaints();
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter === 'All') return true;
    return complaint.status === statusFilter;
  });

  const handleOpenDialog = (touristId, complaintId) => {
    setSelectedTouristId(touristId);
    setSelectedComplaintId(complaintId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReplyComment('');
  };

  const handleSubmitReply = async () => {
    setLoading(true); // Start loading
    try {
      await postComplaintReply(selectedTouristId, replyComment, selectedComplaintId);
      setSnackbarMessage('Reply sent successfully!');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error sending reply:', error);
      setSnackbarMessage('Error sending reply.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', backgroundColor: '#cfe8fc', padding: '10px', marginBottom: '20px' }}>
        Complaints Table
      </h2>
      <div style={{ marginBottom: '20px' }}>
        <FormControl style={{ minWidth: 120, marginRight: '20px' }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={handleFilterStatus}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={handleSortDate}
          variant="contained"
          size="large"
          style={{ marginRight: '20px' }}
        >
          Sort Date {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
        <Button
          onClick={handleResetFilters}
          variant="contained"
          color="secondary"
          size="large"
        >
          Reset
        </Button>
      </div>
      <TableContainer>
        <Table aria-label="complaints table">
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#cfe8fc', width: '20%', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Status
              </TableCell>
              <TableCell style={{ backgroundColor: '#aeeeee', width: '20%', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Date
              </TableCell>
              <TableCell style={{ backgroundColor: '#aeeeee', width: '20%', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Username
              </TableCell>
              <TableCell style={{ backgroundColor: '#aeeeee', width: '20%', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Title
              </TableCell>
              <TableCell style={{ backgroundColor: '#aeeeee', width: '20%', maxWidth: '150px', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Body
              </TableCell>
              <TableCell style={{ backgroundColor: '#aeeeee', width: '20%', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>
                Reply
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComplaints.map((complaint, index) => (
              <TableRow key={complaint._id} style={{ backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#ffffff' }}>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color={complaint.status === 'Pending' ? 'primary' : 'success'}
                    onClick={() => handleChangeStatus(complaint._id, complaint.status)}
                  >
                    {complaint.status}
                  </Button>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{dayjs(complaint.date).format('YYYY-MM-DD')}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{complaint.tourist.username}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{complaint.title}</TableCell>
                <TableCell style={{ maxWidth: '150px', wordWrap: 'break-word', textAlign: 'center' }}>
                  <Tooltip title={complaint.body} arrow>
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {complaint.body}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(complaint.tourist.id, complaint._id)}>
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reply Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to Complaint</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Reply"
            type="text"
            fullWidth
            variant="outlined"
            value={replyComment}
            onChange={(e) => setReplyComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReply} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {/* Loading Spinner above the main screen */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}>
          <CircularProgress />
        </div>
      )}
    </Paper>
  );
}

export default Complaints;
