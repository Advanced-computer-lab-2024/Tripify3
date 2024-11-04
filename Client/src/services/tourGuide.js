import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/tourGuide/profile/${userId}`);
};

export const updateProfile = async (userId, formData) => {
  return await axios.put(`${API_URL}/tourGuide/profile/${userId}`, formData);
};

export const getAllItenerariesForTourGuide = async (userId) => {
  return await axios.get(`${API_URL}/itineraries/get/tour-guide/${userId}`);
};

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/tag/get`);
};

export const markItineraryInappropriate = async (id, data) => {
  return await axios.put(`${API_URL}/itineraries/${id}/edit`, data);
};