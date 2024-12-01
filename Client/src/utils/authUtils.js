// utils/authUtils.js

// Set the user data in sessionStorage
export const setUser = (user) => {
  sessionStorage.setItem("userId", user._id);
  sessionStorage.setItem("username", user.username);
  sessionStorage.setItem("userType", user.type);
  sessionStorage.setItem("userCurrency", user.currency);
  sessionStorage.setItem("userGender", user.gender);
  sessionStorage.setItem("userBirthDate", user.birthDate);
  sessionStorage.setItem("userPreferences", JSON.stringify(user.preferences));
  sessionStorage.setItem("firstTimeLogin", user.firstLogin);
};

// Retrieve the whole user object from sessionStorage
export const getUser = () => {
  const userId = sessionStorage.getItem("userId");
  const username = sessionStorage.getItem("username");
  const userType = sessionStorage.getItem("userType");
  const userCurrency = sessionStorage.getItem("userCurrency");
  const userPreferences = sessionStorage.getItem("userPreferences");
  const userGender = sessionStorage.getItem("userGender");
  const userBirthDate = sessionStorage.getItem("userBirthDate");

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


// Get the userId from sessionStorage
export const getUserId = () => sessionStorage.getItem("userId");

// Get the username from sessionStorage
export const getUsername = () => sessionStorage.getItem("username");

// Get the userType from sessionStorage
export const getUserType = () => sessionStorage.getItem("userType");

// Get the userCurrency from sessionStorage
export const getUserCurrency = () => sessionStorage.getItem("userCurrency");

// Get the userPreferences from sessionStorage
export const getUserPreferences = () => {
  const preferences = sessionStorage.getItem("userPreferences");
  return preferences ? JSON.parse(preferences) : [];
};

// Set the userType in sessionStorage
export const setUserType = (type) => {
  sessionStorage.setItem("userType", type);
};

// Set the userPreferences in sessionStorage
export const setUserPreferences = (preferences) => {
  sessionStorage.setItem("userPreferences", JSON.stringify(preferences));
};

// utils/authUtils.js

// Set tourist booking data
export const setTouristData = ({ tourist, price, type, itemId, tickets, wallet = false }) => {
  sessionStorage.setItem("tourist", tourist || "");
  sessionStorage.setItem("price", price || 0);
  sessionStorage.setItem("itemType", type || "");
  sessionStorage.setItem("itemId", itemId || "");
  sessionStorage.setItem("tickets", tickets || 0);
  sessionStorage.setItem("wallet", JSON.stringify(wallet));
};

// Get tourist booking data
export const getTouristData = () => {
  const tourist = sessionStorage.getItem("tourist") || "";
  const price = parseFloat(sessionStorage.getItem("price")) || 0;
  const type = sessionStorage.getItem("itemType") || "";
  const itemId = sessionStorage.getItem("itemId") || "";
  const tickets = parseInt(sessionStorage.getItem("tickets"), 10) || 0;
  const wallet = sessionStorage.getItem("wallet") === "true"; 
  return { tourist, price, type, itemId, tickets, wallet };
};

// Clear the user data from sessionStorage
export const clearUser = () => {
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("userCurrency");
  sessionStorage.removeItem("userPreferences");

  sessionStorage.removeItem("tourist");
  sessionStorage.removeItem("price");
  sessionStorage.removeItem("itemType");
  sessionStorage.removeItem("itemId");
  sessionStorage.removeItem("details");
  sessionStorage.removeItem("tickets");
};
