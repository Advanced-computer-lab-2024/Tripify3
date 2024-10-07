import axios from "axios";

const API_URL = "http://localhost:8000"; // Replace with your API URL

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/getTags`);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/getCategories`);
};

export const getAllPlaces = async () => {
  return await axios.get(`${API_URL}/places/get`);
};

export const getFilteredPlaces = async (filters) => {
  return await axios.get(`${API_URL}/places/filter`, {
    params: filters, // Pass filters directly here
    paramsSerializer: (params) => {
      return `tags=${encodeURIComponent(params.tags)}`; // Ensure it's serialized as a proper query string
    },
  });
};

export const getAllIteneraries = async () => {
  return await axios.get(`${API_URL}/itinerary/get`);
};

export const getAllActivities = async () => {
  return await axios.get(`${API_URL}/tourist/activity`);
};

export const getProfile = async (userId) => {
  return await axios.get(`${API_URL}/tourist/profile/${userId}`);
};

export const updateProfile = async (userId, formData) => {
  return await axios.put(`${API_URL}/tourist/profile/${userId}`, formData);
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

export const filterItineraries = async (filters) => {
  const { budget, date, language, tags } = filters;
  return await axios.get(`${API_URL}/tourist/itinerary/filter`, {
    params: {
      budget,
      date,
      language,
      tags,
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
