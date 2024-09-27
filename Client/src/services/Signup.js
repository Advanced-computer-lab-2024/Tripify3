// services/signupService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/access/tourist/signup';

export const signup = async (signupData) => {
  try {
    const response = await axios.post(API_URL, signupData);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error('Error during signup:', error);
    throw error; 
  }
};
