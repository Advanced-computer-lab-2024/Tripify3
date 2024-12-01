// utils/authUtils.js

// Set the user data in localStorage
export const setUser = (user) => {
  localStorage.setItem("userId", user._id);
  localStorage.setItem("username", user.username);
  localStorage.setItem("userType", user.type);
  localStorage.setItem("userCurrency", user.currency);
  localStorage.setItem("userGender", user.gender);
  localStorage.setItem("userBirthDate", user.birthDate);
  localStorage.setItem("userPreferences", JSON.stringify(user.preferences));
  localStorage.setItem("firstTimeLogin", user.firstLogin);
};

// Retrieve the whole user object from localStorage
export const getUser = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const userType = localStorage.getItem("userType");
  const userCurrency = localStorage.getItem("userCurrency");
  const userPreferences = localStorage.getItem("userPreferences");
  const userGender = localStorage.getItem("userGender");
  const userBirthDate = localStorage.getItem("userBirthDate");

  if (!userId || !username) {
    return null; // Return null if essential user data is missing
  }

  return {
    _id: userId,
    username: username,
    type: userType,
    currency: userCurrency,
    gender: userGender,
    birthDate: userBirthDate,
    preferences: userPreferences ? JSON.parse(userPreferences) : [],
  };
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

// utils/authUtils.js

// Set tourist booking data
export const setTouristData = ({ tourist, price, type, itemId, tickets, wallet = false }) => {
  localStorage.setItem("tourist", tourist || "");
  localStorage.setItem("price", price || 0);
  localStorage.setItem("itemType", type || "");
  localStorage.setItem("itemId", itemId || "");
  localStorage.setItem("tickets", tickets || 0);
  localStorage.setItem("wallet", JSON.stringify(wallet));
};

// Get tourist booking data
export const getTouristData = () => {
  const tourist = localStorage.getItem("tourist") || "";
  const price = parseFloat(localStorage.getItem("price")) || 0;
  const type = localStorage.getItem("itemType") || "";
  const itemId = localStorage.getItem("itemId") || "";
  const tickets = parseInt(localStorage.getItem("tickets"), 10) || 0;
  const wallet = localStorage.getItem("wallet") === "true";
  return { tourist, price, type, itemId, tickets, wallet };
};

// Clear the user data from localStorage
export const clearUser = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("userType");
  localStorage.removeItem("userCurrency");
  localStorage.removeItem("userPreferences");

  localStorage.removeItem("tourist");
  localStorage.removeItem("price");
  localStorage.removeItem("itemType");
  localStorage.removeItem("itemId");
  localStorage.removeItem("details");
  localStorage.removeItem("tickets");
};
