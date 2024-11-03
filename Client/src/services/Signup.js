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

// Call the upload files API
export const uploadFiles = async (formData) => {
  try {
    const response = await axios.post("http://localhost:8000/user/upload/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Return the response data from the API
  } catch (error) {
    console.error("File upload failed:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
