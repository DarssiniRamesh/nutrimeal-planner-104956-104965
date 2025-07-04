import React from "react";

/**
 * PUBLIC_INTERFACE
 * MealList renders a list of meals (for a given day or the whole plan).
 * Supports action buttons (edit, delete, view) for each meal.
 */
function MealList({ meals, onEdit, onDelete, onView }) {
  // Renders meal items, using meal.id as key to support uuid updates
  return (
    <div>
      <h2>Meals</h2>
      <ul>
        {meals && meals.length > 0
          ? meals.map((meal) => (
              <li key={meal.id || meal.name}>
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
