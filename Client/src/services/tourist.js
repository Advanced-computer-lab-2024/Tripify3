import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const redeemPoints = async (userId, pointsToRedeem) => {
  return await axios.post(`${API_URL}/tourist/profile/${userId}/redeem`, pointsToRedeem);
};

export const getActivityById = async (activityId) => {
  const response = await axios.get(`${API_URL}/activity/get/${activityId}`); // Adjust the endpoint as necessary
  return response;
};
export const getItineraryById = async (id) => {
  const response = await axios.get(`${API_URL}/itinerary/get/${id}`); // Adjust the endpoint as necessary
  return response;
}
export const getAllTags = async () => {
  return await axios.get(`${API_URL}/tag/get`);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/category/get`);
};

export const getAllPlaces = async () => {
  return await axios.get(`${API_URL}`);
};

export const getAllActiveAppropriateIteneraries = async (userId) => {
  return await axios.get(`${API_URL}/itineraries/active/appropriate/get`);
};

export const getAllActivities = async () => {
  return await axios.get(`${API_URL}/activity/get`);
};
export const getAllActivitiesAttended = async (userId) => {
  console.log("hrns:"+ userId)
  return await axios.get(`${API_URL}/activitiesAttended/get/${userId}`);
};
export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/tourist/profile/${userId}`);
};


export const getPlaceById =async(placeid)=>{
  return await axios.get(`${API_URL}/place/get/${placeid}`)
}

export const updateProfile = async (userId, formData) => {
  return await axios.put(`${API_URL}/tourist/profile/${userId}`, formData);
};
