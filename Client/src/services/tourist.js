import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/tag/get`);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/category/get`);
};

export const getAllPlaces = async () => {
  return await axios.get(`${API_URL}/places/get`);
};


export const getAllIteneraries = async () => {
  return await axios.get(`${API_URL}/itinerary/get`);
};

export const getAllActivities = async () => {
  return await axios.get(`${API_URL}/tourist/activity`);
};

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/tourist/profile/${userId}`);
};

export const updateProfile = async (userId, formData) => {
  return await axios.put(`${API_URL}/tourist/profile/${userId}`, formData);
};

