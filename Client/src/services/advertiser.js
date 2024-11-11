import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/user/get/profile/${userId}`);
};

export const updateProfile = async (userId, formData) => {
  return await axios.put(`${API_URL}/advertiser/profile/${userId}`, formData);
};

export const createActivity = async (activity) => {
  return await axios.post(`${API_URL}/advertiser/activity/create`, activity);
};

export const updateActivity = async (activityId, activity) => {
  return await axios.put(`${API_URL}/activity/get/${activityId}`, activity);
};

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/tag/get`);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/categories/get`);
};

export const getAllActivitiesByAdvertiser = async (advertiserId) => {
  return await axios.get(`${API_URL}/advertiser/activity/${advertiserId}`);
};

export const deleteActivity = async (activityId) => {
  return await axios.delete(`${API_URL}/activity/delete/${activityId}`);
};
