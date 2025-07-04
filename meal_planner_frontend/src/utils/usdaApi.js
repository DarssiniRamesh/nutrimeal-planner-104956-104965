 /**
 * PUBLIC_INTERFACE
 * USDA FoodData Central API Utility
 * Provides functions to search for foods, get nutrition details, using API key from .env.
 */

const BASE_URL = process.env.REACT_APP_USDA_API_BASE_URL || "https://api.nal.usda.gov/fdc/v1/";
const API_KEY = process.env.REACT_APP_USDA_API_KEY;

/**
 * PUBLIC_INTERFACE
 * Search foods by query string using USDA API.
 * @param {string} query - user search input (ingredient, food name, etc)
 * @param {number} [pageSize=20] - number of results to return
 * @returns {Promise<Object>} { foods: Array, totalHits, ... }
 * Throws error with status if API rate/bad key/server issue.
 */
export async function searchFoods(query, pageSize = 20) {
  if (!API_KEY) throw new Error("USDA API key missing. Check .env config.");
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("Search term required for food lookup.");
  }
  let url = `${BASE_URL}foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      let msg = `Food search failed (status ${res.status})`;
      if (res.status === 401) msg = "Unauthorized (check API key)";
      if (res.status === 429) msg = "Rate limit exceeded. Try again later.";
      throw new Error(msg);
    }
    const data = await res.json();
    if (!Array.isArray(data.foods)) throw new Error("Unexpected API shape.");
    return data;
  } catch (err) {
    throw new Error("USDA food search error: " + (err.message || err));
  }
}

/**
 * PUBLIC_INTERFACE
 * Retrieve food details by FDC ID via USDA API.
 * @param {number|string} fdcId
 * @returns {Promise<Object>} food detail object (see USDA docs)
 * Throws error for failed API/invalid FDC ID.
 */
export async function getFoodDetails(fdcId) {
  if (!API_KEY) throw new Error("USDA API key missing. Check .env config.");
  if (!fdcId) throw new Error("fdcId required for food detail lookup.");
  let url = `${BASE_URL}food/${fdcId}?api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      let msg = `Get food detail failed (status ${res.status})`;
      if (res.status === 401) msg = "Unauthorized (check API key)";
      if (res.status === 429) msg = "Rate limit exceeded. Try again later.";
      throw new Error(msg);
    }
    const data = await res.json();
    if (!data.fdcId) throw new Error("No such food found.");
    return data;
  } catch (err) {
    throw new Error("USDA food details error: " + (err.message || err));
  }
}
