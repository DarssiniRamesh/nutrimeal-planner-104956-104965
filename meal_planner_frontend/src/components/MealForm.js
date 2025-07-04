import React, { useState } from "react";
import NutritionLookupModal from "./NutritionLookupModal";

/**
 * PUBLIC_INTERFACE
 * MealForm provides a form to add or edit a meal.
 * Includes meal name, date, ingredients, calories, nutrition info, cuisine.
 * All fields except nutrition info, cuisine are required. Ingredients is a list of strings.
 * Now supports: "Add Nutrition Info From USDA" (`nutritionInfoText` field populates from modal selector).
 */
function MealForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [ingredientsText, setIngredientsText] = useState(
    initialData
      ? (Array.isArray(initialData.ingredients) ? initialData.ingredients.join(", ") : Array.isArray(initialData.ingredients) ? "" : (typeof initialData.ingredients === "string" ? initialData.ingredients : (initialData.ingredients || [])))
      : ""
  );
  const [calories, setCalories] = useState(
    initialData?.calories ? String(initialData.calories) : ""
  );
  const [cuisine, setCuisine] = useState(initialData?.cuisine || "");
  const [nutritionInfoText, setNutritionInfoText] = useState(
    initialData?.nutrition_info
      ? JSON.stringify(initialData.nutrition_info)
      : ""
  );
  const [error, setError] = useState(null);

  // Support showing USDA modal
  const [usdaModalOpen, setUSDAModalOpen] = useState(false);

  function handleIngredientsInput(e) {
    setIngredientsText(e.target.value);
  }

  function handleNutritionInput(e) {
    setNutritionInfoText(e.target.value);
  }

  // Handler: pull nutrition obj from modal and populate textarea and calories field
  function handleUSDASelect(nutrObj) {
    if (typeof nutrObj !== "object" || !nutrObj) return;
    try {
      setNutritionInfoText(JSON.stringify(nutrObj, null, 2));
      // Try to extract calories and auto-fill
      if (nutrObj.labelNutrients && nutrObj.labelNutrients.calories && nutrObj.labelNutrients.calories.value) {
        setCalories(String(nutrObj.labelNutrients.calories.value));
      } else if (nutrObj.foodNutrients) {
        const en = nutrObj.foodNutrients.find(n => n.nutrientName && n.nutrientName.toLowerCase().includes("energy") && n.unitName && n.unitName.toLowerCase().includes("kcal"));
        if (en && typeof en.value === "number") setCalories(String(en.value));
      }
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    // minimal validation
    if (!name.trim() || !date || !calories) {
      setError("Please enter required fields: name, date, calories.");
      return;
    }

    let ingredients;
    try {
      ingredients = ingredientsText
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    } catch {
      setError("Ingredients must be comma-separated.");
      return;
    }
    let nutrition_info;
    if (nutritionInfoText) {
      try {
        nutrition_info = JSON.parse(nutritionInfoText);
      } catch {
        setError("Nutrition Info must be valid JSON.");
        return;
      }
    }

    const payload = {
      name,
      date,
      ingredients,
      calories: Number(calories),
      cuisine: cuisine || undefined,
      nutrition_info: nutrition_info || undefined,
    };
    try {
      await onSubmit(payload);
    } catch (e) {
      setError(e.message || "Could not save meal.");
    }
  }

  return (
    <div>
      <h2>{initialData ? "Edit Meal" : "Add Meal"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Meal name<span style={{ color: "red" }}>*</span>
            <input
              type="text"
              value={name}
              required
              onChange={e => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Date<span style={{ color: "red" }}>*</span>
            <input
              type="date"
              value={date}
              required
              onChange={e => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Ingredients <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              placeholder="Comma-separated (e.g., chicken, rice, broccoli)"
              value={ingredientsText}
              required
              onChange={handleIngredientsInput}
            />
          </label>
        </div>
        <div>
          <label>
            Calories<span style={{ color: "red" }}>*</span>
            <input
              type="number"
              min={0}
              value={calories}
              required
              onChange={e => setCalories(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Cuisine
            <input
              type="text"
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              placeholder="(optional)"
            />
          </label>
        </div>
        <div>
          <label>
            Nutrition Info{" "}
            <textarea
              placeholder="Paste JSON here (optional)"
              value={nutritionInfoText}
              rows={2}
              style={{ minWidth: 220, fontFamily: "monospace" }}
              onChange={handleNutritionInput}
            />
            <button
              type="button"
              style={{ marginLeft: 8, background: "#27AE60", color: "#fff", padding: "2px 12px", fontWeight: 600, borderRadius: 7 }}
              onClick={() => setUSDAModalOpen(true)}>
              Add Nutrition From USDA
            </button>
          </label>
        </div>
        <div style={{ marginTop: 14 }}>
          <button type="submit" style={{ marginRight: 8 }}>Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
          {error && (
            <div style={{ color: "red", marginTop: 8, fontSize: 15 }}>
              {error}
            </div>
          )}
        </div>
      </form>
      {/* USDA Lookup Modal for live nutrition lookup */}
      <NutritionLookupModal
        isOpen={usdaModalOpen}
        onClose={() => setUSDAModalOpen(false)}
        onSelect={handleUSDASelect}
      />
    </div>
  );
}

export default MealForm;
