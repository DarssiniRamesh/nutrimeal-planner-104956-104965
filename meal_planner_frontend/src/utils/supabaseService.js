import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * Supabase Service Utility for meals table CRUD.
 * Assumes user is authenticated with Supabase Auth. See frontend/README.md for .env config notes.
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
 * Gets logged-in user using Supabase Auth.
 * @returns user object or null
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (!error && data && data.user) return data.user;
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Get all meals for the logged-in user (optionally filter by date).
 * @param {Object} opts - Optional filter, { date }
 * @returns {Array} meals[]
 */
export async function getMeals({ date } = {}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  let query = supabase.from('meals').select('*').eq('user_id', user.id).order('date', { ascending: true });
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
 * Create a new meal (for the Supabase-authenticated user).
 * @param {Object} mealData - { name, date, ingredients, calories, nutrition_info, cuisine }
 * @returns inserted meal row
 */
export async function createMeal(mealData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const insertData = { ...mealData, user_id: user.id };
  const { data, error } = await supabase.from('meals').insert([insertData]).select();
  if (error) {
    console.error("Failed to create meal:", error);
    throw error;
  }
  return data[0];
}

/**
 * PUBLIC_INTERFACE
 * Update an existing meal.
 * @param {string} mealId - Meal row uuid
 * @param {Object} mealData - Fields to update
 * @returns updated meal row
 */
export async function updateMeal(mealId, mealData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const { data, error } = await supabase
    .from('meals')
    .update(mealData)
    .eq('id', mealId)
    .eq('user_id', user.id)
    .select();
  if (error) {
    console.error("Failed to update meal:", error);
    throw error;
  }
  return data[0];
}

/**
 * PUBLIC_INTERFACE
 * Delete meal for user by id.
 * @param {string} mealId
 * @returns void
 */
export async function deleteMeal(mealId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated.");
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)
    .eq('user_id', user.id);
  if (error) {
    console.error("Failed to delete meal:", error);
    throw error;
  }
}
