import React from "react";

/**
 * PUBLIC_INTERFACE
 * Recommendations component shows meal suggestions based on user preferences, cuisines, or nutritional needs.
 */
function Recommendations({ recommendations, onAddMeal }) {
  // TODO: Implement UI for listing recommendations, details, and quick add
  return (
    <div>
      <h2>Recommended Meals</h2>
      {/* List of recommended meals */}
      <ul>
        {(recommendations && recommendations.length > 0)
          ? recommendations.map((item, idx) => (
              <li key={idx}>
                {item.name}
                <button onClick={() => onAddMeal(item)}>Add</button>
              </li>
            ))
          : <li>No recommendations available.</li>}
      </ul>
    </div>
  );
}

export default Recommendations;
