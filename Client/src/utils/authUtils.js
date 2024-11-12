// utils/authUtils.js

// Set the user data in localStorage
export const setUser = (user) => {
  localStorage.setItem("userId", user._id);
  localStorage.setItem("username", user.username);
  localStorage.setItem("userType", user.type);
  localStorage.setItem("userCurrency", user.currency);
  localStorage.setItem("userPreferences", JSON.stringify(user.preferences));
};

// Get the userId from localStorage
export const getUserId = () => localStorage.getItem("userId");

// Get the username from localStorage
export const getUsername = () => localStorage.getItem("username");

// Get the userType from localStorage
export const getUserType = () => localStorage.getItem("userType");

// Get the userCurrency from localStorage
export const getUserCurrency = () => localStorage.getItem("userCurrency");

// Get the userPreferences from localStorage
export const getUserPreferences = () => {
  const preferences = localStorage.getItem("userPreferences");
  return preferences ? JSON.parse(preferences) : [];
};

// Set the userType in localStorage
export const setUserType = (type) => {
  localStorage.setItem("userType", type);
};

// Set the userPreferences in localStorage
export const setUserPreferences = (preferences) => {
  localStorage.setItem("userPreferences", JSON.stringify(preferences));
};

// Clear the user data from localStorage
export const clearUser = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("userType");
  localStorage.removeItem("userCurrency");
  localStorage.removeItem("userPreferences");
};
