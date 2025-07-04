 /**
 * PUBLIC_INTERFACE
 * USDA FoodData Central API Utility
 * Provides functions to search for foods, get nutrition details, using API key from .env.
 *
 * Defensive error handling for environment variable loading.
 *
 * - For Create React App: .env should be in the root of meal_planner_frontend.
 * - Variable should be named REACT_APP_USDA_API_KEY.
 * - Must restart the dev server after changing .env.
 */

const BASE_URL = process.env.REACT_APP_USDA_API_BASE_URL || "https://api.nal.usda.gov/fdc/v1/";
const API_KEY = process.env.REACT_APP_USDA_API_KEY;

// Diagnostic: Log variable presence in development mode (never log the actual key)
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.log("USDA API Key loaded?", !!API_KEY, "(REACT_APP_USDA_API_KEY defined in env)", process.env.REACT_APP_USDA_API_KEY ? "(Found)" : "(Missing or not loaded)");
}

/**
 * Throws a diagnostic error if the USDA API key is missing.
 */
function requireUsdaApiKey() {
  if (!API_KEY) {
    let details =
      "USDA API key missing. This is required to access the FoodData Central API.\n\n" +
      "Troubleshooting:\n" +
      "- Ensure .env exists in 'meal_planner_frontend/' directory (NOT project root).\n" +
      "- The variable name must be REACT_APP_USDA_API_KEY.\n" +
      "- You MUST restart the dev server after editing .env (stop and re-run 'npm start').\n" +
      "- Do NOT commit your actual API key to version control.\n" +
      "- To see variables loaded, add 'console.log(process.env.REACT_APP_USDA_API_KEY);' in your code.\n";
    // Show all env keys for developers (not in production)
    if (process.env.NODE_ENV !== "production") {
      details += "\nLoaded env keys: " + Object.keys(process.env).filter(k => k.startsWith("REACT_APP_")).join(", ");
    }
    throw new Error(details);
  }
}

/**
 * PUBLIC_INTERFACE
 * Search foods by query string using USDA API.
 * @param {string} query - user search input (ingredient, food name, etc)
 * @param {number} [pageSize=20] - number of results to return
 * @returns {Promise<Object>} { foods: Array, totalHits, ... }
 * Throws error with status if API rate/bad key/server issue.
 */
export async function searchFoods(query, pageSize = 20) {
  requireUsdaApiKey();
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
  requireUsdaApiKey();
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
