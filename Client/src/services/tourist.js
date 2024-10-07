import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/getTags`);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/getCategories`);
};

export const getAllPlaces = async () => {
  return await axios.get(`${API_URL}/tourist/historicalPlaces`);
};

export const getAllIteneraries = async () => {
  return await axios.get(`${API_URL}/tourist/itinerary`);
};

export const getAllActivities = async () => {
  return await axios.get(`${API_URL}/tourist/activity`);
};

export const filterActivities = async (filters) => {
  const { minPrice, maxPrice, category, rating } = filters;
  return await axios.get(`${API_URL}/tourist/activity/filter`, {
    params: {
      minPrice,
      maxPrice,
      category,
      rating,
    },
  });
};

export const sortActivities = async (filters) => {
    const { price, rating, date } = filters;
    return await axios.get(`${API_URL}/tourist/activity/sort`, {
      params: {
        price,
        rating,
        date,
        
      },
    });
  };
  

