

// Constants for localStorage keys
const USER_ID_KEY = 'userId';
const TOKEN_KEY = 'token';

/**
 * Saves the user ID to localStorage
 * @param {string} userId - The user ID to be saved.
 */
export const setUserId = (userId) => {
    localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Retrieves the user ID from localStorage
 * @returns {string|null} - The user ID or null if it doesn't exist.
 */
export const getUserId = () => {
    return localStorage.getItem(USER_ID_KEY);
}

/**
 * Saves the authentication token to localStorage
 * @param {string} token - The token to be saved.
 */
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the authentication token from localStorage
 * @returns {string|null} - The token or null if it doesn't exist.
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Removes the user ID and token from localStorage
 */
export const clearAuth = () => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Checks if the user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise.
 */
export const isAuthenticated = () => {
    return !!getToken();
}

/**
 * You could also add more utility functions depending on how your app needs to handle authentication.
 */

export default {
    setUserId,
    getUserId,
    setToken,
    getToken,
    clearAuth,
    isAuthenticated
};