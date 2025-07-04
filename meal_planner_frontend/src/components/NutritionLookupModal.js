import React from "react";

/**
 * PUBLIC_INTERFACE
 * NutritionLookupModal displays a modal to search foods and fetch nutrition data from the USDA API.
 * Handles search input, shows results, allows selection, and displays nutrient details.
 */
function NutritionLookupModal({ isOpen, onClose, onSelect }) {
  // TODO: Implement modal UI, search food, show nutrition, allow selection
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Nutrition Lookup</h3>
        <p>(Search UI and results here...)</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NutritionLookupModal;
