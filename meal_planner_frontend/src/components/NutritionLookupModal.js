import React, { useState } from "react";
import { searchFoods, getFoodDetails } from "../utils/usdaApi";

/**
 * PUBLIC_INTERFACE
 * NutritionLookupModal displays a modal to search foods and fetch nutrition data from the USDA API.
 * - Allows user to enter search, shows matching foods, loads nutritional info for each.
 * - Lets user select an item to bind nutrition data (calls onSelect(nutrientObj)).
 * - Shows loading, error, and minimal details for each found food.
 */
function NutritionLookupModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // {fdcId,...}
  const [details, setDetails] = useState(null); // Detailed food info
  const [detailLoading, setDetailLoading] = useState(false);

  // Handler: search by query (ingredient or food)
  async function handleSearch(e) {
    e.preventDefault();
    setFoods([]);
    setDetails(null);
    setSelected(null);
    setError("");
    setSearching(true);
    try {
      const data = await searchFoods(search, 10);
      setFoods((data.foods || []).slice(0, 10));
      if (!data.foods?.length) setError("No results found.");
    } catch (err) {
      setError(err.message || "Could not look up food.");
      setFoods([]);
    }
    setSearching(false);
  }

  // Handler: user clicks on a search result, loads detail from API
  async function viewDetails(food) {
    setDetails(null);
    setSelected(food);
    setError("");
    setDetailLoading(true);
    try {
      const info = await getFoodDetails(food.fdcId);
      setDetails(info);
    } catch (err) {
      setError(err.message || "Could not fetch nutrition info.");
    }
    setDetailLoading(false);
  }

  // Handler: confirm selection & pass data up
  function handleSelect() {
    if (details) {
      onSelect && onSelect(details);
      if (onClose) onClose();
    }
  }

  // Modal not open: don't render
  if (!isOpen) return null;

  // Minimal render: modal overlay, search, list, nutrition, select/close
  return (
    <div className="modal-overlay" style={{ zIndex: 1500 }}>
      <div className="modal-dialog" style={{ minWidth: 330, maxWidth: 450 }}>
        <h2 style={{ marginBottom: 16 }}>Nutrition Lookup</h2>
        <form style={{ display: "flex", gap: 6, marginBottom: 14 }} onSubmit={handleSearch}>
          <input
            autoFocus
            aria-label="Food search"
            style={{
              flex: 1,
              padding: "0.5em",
              fontSize: 16,
              borderRadius: 5,
              border: "1px solid #bbb",
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter food (e.g., apple, chicken breast)..."
            disabled={searching}
          />
          <button type="submit" style={{ fontWeight: 700 }}>Search</button>
        </form>
        {searching && <div style={{ color: "#494", fontSize: 16, margin: "8px 0" }}>Searching...</div>}
        {error && <div style={{ color: "tomato", margin: "8px 0" }}>{error}</div>}

        {/* Search Results */}
        {foods.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: "#2D9CDB", marginBottom: 5 }}>Results:</div>
            <ul style={{ padding: 0, margin: 0, listStyle: "none", maxHeight: 180, overflowY: "auto" }}>
              {foods.map(f => (
                <li
                  key={f.fdcId}
                  style={{
                    border: "1px solid #e5e9ef",
                    background: selected?.fdcId === f.fdcId ? "#e6f9ed" : "#fafcff",
                    borderRadius: 7,
                    marginBottom: 4,
                    padding: "5px 7px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ flex: 1, fontWeight: 500 }}>{f.description}</span>
                  <button
                    type="button"
                    onClick={() => viewDetails(f)}
                    style={{
                      background: "#F2994A",
                      color: "#fff",
                      fontWeight: 600,
                      marginLeft: 8,
                      borderRadius: 7,
                      padding: "4px 18px",
                    }}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nutrition details section  */}
        {detailLoading && <div style={{ color: "#27AE60", fontSize: 16 }}>Loading nutrition...</div>}
        {details && (
          <div style={{
              border: "1.4px solid #2D9CDB70",
              background: "#f8fdfb",
              borderRadius: 8,
              padding: 13,
              marginTop: 4,
              marginBottom: 10,
              minWidth: 260,
            }}>
            <div style={{ fontWeight: 700, marginBottom: 5 }}>{details.description}</div>
            {details.brandOwner && <div style={{ fontSize: 14 }}>{details.brandOwner}</div>}
            {/* Show summary nutrition */}
            <div style={{ fontSize: 15, color: "#373" }}>
              <strong>Nutrition (per 100g):</strong>
            </div>
            {details.labelNutrients ? (
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 15 }}>
                {Object.entries(details.labelNutrients).map(([key, val]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {val.value} {nutrientUnit(key)}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#999" }}>(No summary label nutrients.)</div>
            )}
            {/* Attribution */}
            <div style={{ fontSize: 11, color: "#659", marginTop: 6, fontStyle: "italic" }}>
              Data: USDA FoodData Central
            </div>
            <button onClick={handleSelect} style={{ marginTop: 10, minWidth: 72 }}>Add To Meal</button>
          </div>
        )}

        {/* Modal Footer */}
        <button type="button" onClick={onClose} style={{ background: "#bbb", color: "#1a1a1a" }}>
          Close
        </button>
      </div>
    </div>
  );
}

// Map USDA nutrient keys to unit abbreviations.
function nutrientUnit(key) {
  if (!key) return "";
  if (key === "calories") return "kcal";
  if (key === "fat") return "g";
  if (key === "protein") return "g";
  if (key === "carbohydrates") return "g";
  return "";
}

export default NutritionLookupModal;
