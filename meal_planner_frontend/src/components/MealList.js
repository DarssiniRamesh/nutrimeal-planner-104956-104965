import React from "react";

/**
 * PUBLIC_INTERFACE
 * MealList renders a list of meals (for a given day or the whole plan).
 * Supports action buttons (edit, delete, view) for each meal.
 */
/**
 * MealsList - Renders a list of meals with improved accessibility, bigger touch targets, and a meal duplicate ("copy") button.
 * Now: ARIA tags, visually clearer focus for accessibility, keyboard navigation, responsive/touch-friendly, and meal duplication button.
 */
function MealList({ meals, onEdit, onDelete, onView, onDuplicate }) {
  return (
    <div>
      <h2 id="meals-heading" style={{ marginTop: 0, fontWeight: 700 }}>Meals</h2>
      <ul aria-labelledby="meals-heading" style={{ padding: 0, margin: 0 }}>
        {meals && meals.length > 0
          ? meals.map((meal, idx) => (
              <li
                key={meal.id || meal.name + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 9,
                  background: "#fafdff",
                  borderRadius: 8,
                  boxShadow: "0 1px 5px -3px #2D9CDB16",
                  padding: "7px 7px 7px 11px",
                  fontSize: 16,
                  minHeight: 41,
                  flexWrap: "wrap",
                }}
                tabIndex={0}
                aria-label={`Meal: ${meal.name}`}
                onKeyDown={e => {
                  if (e.key === "Enter") onView(meal);
                }}
              >
                <strong style={{flex: 2}}>{meal.name}</strong>
                <span style={{color: '#666', fontSize: 13, marginRight:3, flex: 1}}>
                  {meal.calories != null && <span>{meal.calories} kcal</span>}
                  {meal.cuisine && <span> | <span style={{color: "#27AE60"}}>{meal.cuisine}</span></span>}
                </span>
                <button
                  aria-label={`View ${meal.name}`}
                  onClick={() => onView(meal)}
                  style={btnStyle}
                  tabIndex={0}
                >View</button>
                <button
                  aria-label={`Edit ${meal.name}`}
                  onClick={() => onEdit(meal)}
                  style={btnStyle}
                  tabIndex={0}
                >Edit</button>
                <button
                  aria-label={`Delete ${meal.name}`}
                  onClick={() => onDelete(meal)}
                  style={{...btnStyle, background: "#fff4ef", color:"#d14"}}
                  tabIndex={0}
                >Delete</button>
                <button
                  aria-label={`Duplicate ${meal.name}`}
                  onClick={() => onDuplicate && onDuplicate(meal)}
                  style={{...btnStyle, background: "#ecf9ff", color: "#2446a1"}}
                  tabIndex={0}
                  title="Copy this meal for quick entry"
                >Duplicate</button>
              </li>
            ))
          : <li style={{fontSize:15, color:"#778", padding: "7px 0"}}>No meals found.</li>}
      </ul>
    </div>
  );
}

// Reusable button style for big, touch-friendly buttons
const btnStyle = {
  borderRadius: 6,
  padding: "6px 12px",
  fontWeight: 600,
  fontSize: "1em",
  background: "#d9ebfe",
  color: "#237",
  border: "none",
  cursor: "pointer",
  marginLeft: 3,
  marginRight: 2,
  outline: "none",
  transition: "background .15s"
};


export default MealList;
