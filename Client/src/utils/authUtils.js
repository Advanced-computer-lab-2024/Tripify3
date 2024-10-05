// utils/authUtils.js

let userId = null;
let username = null;
let userType = null;

export const setUser = (user) => {
  userId = user._id;
  username = user.username;
  userType = user.type;
};

export const getUserId = () => userId;
export const getUsername = () => username;
export const getUserType = () => userType;

export const clearUser = () => {
  userId = null;
  username = null;
  userType = null;
};
