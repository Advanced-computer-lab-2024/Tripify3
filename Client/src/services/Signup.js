// services/signupService.js
import axios from "axios";

const API_URL = "http://localhost:8000/access/user/signup";

export const signup = async (signupData) => {
  try {
    const response = await axios.post(API_URL, signupData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("error response from backend:", error.response.data);
    throw error;
  }
};
