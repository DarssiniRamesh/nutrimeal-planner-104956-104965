/**
 * PUBLIC_INTERFACE
 * USDA FoodData Central API Utility
 * Provides functions to search for foods, get nutrition details, using API key from .env.
 */

const BASE_URL = process.env.REACT_APP_USDA_API_BASE_URL || "https://api.nal.usda.gov/fdc/v1/";
const API_KEY = process.env.REACT_APP_USDA_API_KEY;

/**
 * Search foods by query string.
 * @param {string} query
 */
export async function searchFoods(query) {
  // Implement API call to /foods/search
  // Example: `${BASE_URL}foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
  throw new Error("searchFoods not implemented yet");
}

/**
 * Retrieve food details by FDC ID.
 * @param {number|string} fdcId
 */
export async function getFoodDetails(fdcId) {
  // Implement API call to /food/{fdcId}
  // Example: `${BASE_URL}food/${fdcId}?api_key=${API_KEY}`
  throw new Error("getFoodDetails not implemented yet");
}
