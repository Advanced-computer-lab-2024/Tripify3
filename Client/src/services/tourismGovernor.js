import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getProfile = async (userId) => {
    return await axios.get(`${API_URL}/user/get/profile/${userId}`);
  };
  
  export const changePassword = async (formData) => {
    return await axios.put(`${API_URL}/user/change/password`, formData);
  };
  