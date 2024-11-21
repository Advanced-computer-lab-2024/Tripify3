import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getAllItineraries = async (userId) => {
  return await axios.get(`${API_URL}/itineraries/get`);
};
export const markItineraryInappropriate = async (id, data) => {
  return await axios.put(`${API_URL}/itinerary/inappropriate/${id}`, data);
};

export const markActivityInappropriate = async (id, data) => {
  return await axios.put(`${API_URL}/activity/inappropriate/${id}`, data);
};


export const createActivity = async (activity) => {
  return await axios.post(`${API_URL}/activity/create`, activity);
};

export const updateActivity = async (advertiserId, activityId, activity) => {
  return await axios.put(`${API_URL}/advertiser/activity/${advertiserId}/${activityId}`, activity);
};

export const getUploadedFiles = async (userId) => {
  return await axios.get(`${API_URL}/user/files/${userId}`);
};
export const getAllAcceptedUsers = async () => {
  return await axios.get(`${API_URL}/users/accepted`);
};

export const getAllPendingUsers = async () => {
  return await axios.get(`${API_URL}/users/pending`);
};

export const removeUser = async (id) => {
  return await axios.delete(`${API_URL}/admin/user/delete/${id}`); // Use DELETE method and correct endpoint
};

export const addUser = async (userData) => {
  return await axios.post(`${API_URL}/admin/user/add`, userData); // Use POST method and pass userData
};

export const updateUserStatus = async (id, status) => {
  return await axios.put(`${API_URL}/user/update/status/${id}`, { status }); // Use PUT method and pass the new status
};

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/tag/get`);
};

// Corrected createTag function to send the tag name in the request body
export const createTag = async (tag) => {
  return await axios.post(`${API_URL}/tag/create`, tag);
};

// Corrected deleteTag function to send the tag id in the URL
export const deleteTag = async (id) => {
  return await axios.delete(`${API_URL}/tag/delete/${id}`);
};

// Corrected editTag function to send oldName and newName in the request body
export const editTag = async (tagData) => {
  return await axios.put(`${API_URL}/tag/update`, tagData);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/categories/get`);
};

export const createCategory = async (categoryData) => {
  return await axios.post(`${API_URL}/admin/category/create`, categoryData);
};

export const editCategory = async (categoryData) => {
  return await axios.put(`${API_URL}/admin/category/update`, categoryData);
};

export const deleteCategory = async (categoryData) => {
  return await axios.delete(`${API_URL}/admin/category/delete`, { data: categoryData });
};

export const getAllComplaints = async () => {
  return await axios.get(`${API_URL}/complaints/get`);
};
export const getComplaintById = async (id) => {
  return await axios.get(`${API_URL}/admin/complaint/get/${id}`);
};
export const putComplaintStatus = async (id, status) => {
  return await axios.put(`${API_URL}/admin/complaint/mark-status/${id}`, { status });
};

export const postComplaintReply = async (touristId, reply, complaintId) => {
  return await axios.post(`${API_URL}/admin/complaint/reply`, { reply, touristId,complaintId });
};
