import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/user/get/profile/${userId}`);
};

export const changePassword = async (formData) => {
  return await axios.put(`${API_URL}/user/change/password`, formData);
};

export const getPlaceDetails =async(placeid)=>{
  return await axios.get(`${API_URL}/place/get/${placeid}`)
}

export const updatePlace = async (placeId, formData) => {
  return await axios.put(`${API_URL}/governor/update/place/${placeId}`, formData);
};

export const createPlace = async (formData) => {
  return await axios.post(`${API_URL}/place/create`, formData);
};
