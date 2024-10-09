// utils/authUtils.js

// Set the user data in localStorage
export const setUser = (user) => {
  localStorage.setItem("userId", user._id);
  localStorage.setItem("username", user.username);
  localStorage.setItem("userType", user.type);
};

// Get the userId from localStorage
export const getUserId = () => localStorage.getItem("userId");

// Get the username from localStorage
export const getUsername = () => localStorage.getItem("username");

// Get the userType from localStorage
export const getUserType = () => localStorage.getItem("userType");

// Clear the user data from localStorage
export const clearUser = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("userType");
};
