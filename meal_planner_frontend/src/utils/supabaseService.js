import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * Supabase Service Utility for meals table CRUD for a fully open, no-authentication, shared meal database.
 * No authentication/user logic; all CRUD acts on the global meals table.
 */

/**
 * Bootstrap client via environment variable config.
 * Throws an error if required variables are not properly loaded.
 */
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase environment variables are missing. " +
    "Please check your .env file for REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * PUBLIC_INTERFACE
 * Get all meals (optionally filter by date). No authentication required.
 * @param {Object} opts - Optional filter, { date }
 * @returns {Array} meals[]
 */
export async function getMeals({ date } = {}) {
  let query = supabase.from('meals').select('*').order('date', { ascending: true });
  if (date) query = query.eq('date', date);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch meals:", error);
    throw error;
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Create a new meal (anyone can insert).
 * @param {Object} mealData - { name, date, ingredients, calories, nutrition_info, cuisine }
 * @returns inserted meal row
 */
export async function createMeal(mealData) {
  const { data, error } = await supabase.from('meals').insert([mealData]).select();
  if (error) {
    console.error("Failed to create meal:", error);
    throw error;
  }
  return data[0];
}

/**
 * PUBLIC_INTERFACE
 * Update an existing meal by id. (No authentication restriction.)
 * @param {string} mealId - Meal row uuid
 * @param {Object} mealData - Fields to update
 * @returns updated meal row
 */
export async function updateMeal(mealId, mealData) {
  const { data, error } = await supabase
    .from('meals')
    .update(mealData)
    .eq('id', mealId)
    .select();
  if (error) {
    console.error("Failed to update meal:", error);
    throw error;
  }
  return data[0];
}

/**
 * PUBLIC_INTERFACE
 * Delete meal by id. (Anyone can delete any meal.)
 * @param {string} mealId
 * @returns void
 */
export async function deleteMeal(mealId) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);
  if (error) {
    console.error("Failed to delete meal:", error);
    throw error;
  }
}
