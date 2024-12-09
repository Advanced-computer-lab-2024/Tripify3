import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const redeemPoints = async (userId, pointsToRedeem) => {
  return await axios.post(`${API_URL}/tourist/profile/${userId}/redeem`, pointsToRedeem);
};
export const getAllItineraries = async (userId) => {
  return await axios.get(`${API_URL}/itineraries/get`);
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
  return await axios.get(`${API_URL}/categories/get`);
};

export const getAllPlaces = async () => {
  return await axios.get(`${API_URL}`);
};

export const getUserProfile = async(userId) =>{
  return  await axios.get(`${API_URL}/tourist/profile/${userId}`)
}

export const getAllActiveAppropriateIteneraries = async (userId) => {
  return await axios.get(`${API_URL}/itineraries/active/appropriate/get/${userId}`);
};

export const getAllActivities = async () => {
  return await axios.get(`${API_URL}/activity/get`);
};

export const getAllActivitiesForTourist = async (userId) => {
  return await axios.get(`${API_URL}/tourist/activity/get/${userId}`);
};


export const getAllActivitiesForGuest = async () => {
  return await axios.get(`${API_URL}/guest/activity/get`);
};


export const getAllActivitiesForAdvertiser = async (userId) => {
  return await axios.get(`${API_URL}/advertiser/activity/${userId}`);
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

export const toggleBookmark = async ( formData) => {
  return await axios.post(`${API_URL}/toggle-bookmark`, formData);
};
  
  