import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const createActivity = async (activity) => {
  return await axios.post(`${API_URL}/activities`, activity);
};

export const updateActivity = async (advertiserId, activityId, activity) => {
  return await axios.put(`${API_URL}/activities/${advertiserId}/${activityId}`, activity);
};

export const getAllActivitiesByAdvertiser = async (advertiserId) => {
  return await axios.get(`${API_URL}/advertiser/activity/${advertiserId}`);
};

export const deleteActivity = async (advertiserId, activityId) => {
  return await axios.delete(`${API_URL}/activities/${advertiserId}/${activityId}`);
};
