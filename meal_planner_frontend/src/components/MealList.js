import React from "react";

/**
 * PUBLIC_INTERFACE
 * MealList renders a list of meals (for a given day or the whole plan).
 * Supports action buttons (edit, delete, view) for each meal.
 */
function MealList({ meals, onEdit, onDelete, onView }) {
  // TODO: Implement UI for displaying meals and action buttons
  return (
    <div>
      <h2>Meals</h2>
      <ul>
        {/* Render meal items here */}
        {meals && meals.length > 0
          ? meals.map((meal, idx) => (
              <li key={idx}>
                {meal.name}
                <button onClick={() => onView(meal)}>View</button>
                <button onClick={() => onEdit(meal)}>Edit</button>
                <button onClick={() => onDelete(meal)}>Delete</button>
              </li>
            ))
          : <li>No meals found.</li>}
      </ul>
    </div>
  );
}

export default MealList;
