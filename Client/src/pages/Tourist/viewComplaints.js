import React, { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils.js";
import axios from "axios";
import { Container, Typography, TextField, Select, MenuItem, Button, Card, CardContent, Grid, CircularProgress, Alert } from "@mui/material";

const ViewComplaints = () => {
  const id = getUserId();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/complaints/${id}`);

        if (Array.isArray(response.data.data)) {
          setComplaints(response.data.data);
          setFilteredComplaints(response.data.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        setError("Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaints();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const filtered = complaints.filter((complaint) => {
      const matchesName = complaint.title.toLowerCase().includes(searchName.toLowerCase());
      const matchesStatus = selectedStatus ? complaint.status === selectedStatus : true;
      return matchesName && matchesStatus;
    });
    setFilteredComplaints(filtered);
  }, [searchName, selectedStatus, complaints]);

  const resetFilters = () => {
    setSearchName("");
    setSelectedStatus("");
    setFilteredComplaints(complaints);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, maxWidth: "md" }}>
      <Typography variant="h4" align="center" gutterBottom>
        All Complaints
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth variant="outlined" label="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select fullWidth variant="outlined" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} displayEmpty>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button fullWidth variant="contained" color="primary" onClick={resetFilters}>
            Reset
          </Button>
        </Grid>
      </Grid>

      {filteredComplaints.length > 0 ? (
        <Grid container spacing={2}>
          {filteredComplaints.map((complaint) => (
            <Grid item xs={12} key={complaint._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {complaint.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Body:</strong> {complaint.body}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Status:</strong> {complaint.status}
                  </Typography>
                  {/* Admin Replies Section */}
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Admin Replies:
                  </Typography>
                  {complaint.adminReplies && complaint.adminReplies.length > 0 ? (
                    complaint.adminReplies.map((reply, index) => (
                      <Typography key={index} variant="body2" color="textSecondary">
                        {index + 1}. {reply}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No replies from admin yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center" color="textSecondary" variant="body1" sx={{ mt: 4 }}>
          No complaints found.
        </Typography>
      )}
    </Container>
  );
};

export default ViewComplaints;
