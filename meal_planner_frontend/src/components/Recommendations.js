import React, { useState } from "react";
import Button from "./ui/Button";

/**
 * PUBLIC_INTERFACE
 * Recommendations component shows meal suggestions based on user preferences, cuisines, or nutritional needs.
 * Features:
 * - Visually highlights cuisine, calories, and source (local/USDA)
 * - Supports quick add (calls onAddMeal with suggestion data)
 * - Displays info-engaging cards for suggestions
 * - States when no recommendations and tips for improvement
 */
function Recommendations({ recommendations, onAddMeal, cuisines }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div>
        <h2 style={{ color: "#2D9CDB", marginBottom: 0 }}>Recommended Meals</h2>
        <div style={{ color: "#999", fontSize: 15, margin: "12px 0" }}>
          No recommendations available.<br />
          {(!cuisines || cuisines.length === 0) ?
            <span>Set some favorite cuisines above to get personalized suggestions.</span>
            :
            <span>Try adding more meals or adjust your cuisine list!</span>
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#2D9CDB", marginBottom: 10 }}>Recommended Meals</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 6 }}>
        {recommendations.slice(0, 9).map((item, idx) => (
          <div
            key={item.name + idx}
            style={{
              border: "1.5px solid #e5e9ef",
              background: "#fafdff",
              borderRadius: 10,
              padding: "13px 12px 10px 12px",
              boxShadow: "0 1px 5px -2px #2D9CDB18",
              display: "flex",
              alignItems: "flex-start",
              position: "relative"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#222" }}>
                {item.name}
                {item.cuisine && (
                  <span
                    style={{
                      color: "#27AE60",
                      background: "#DFF8EE",
                      marginLeft: 8,
                      fontSize: 13,
                      borderRadius: 6,
                      padding: "2px 9px"
                    }}
                  >
                    {item.cuisine}
                  </span>
                )}
                {item.source === "history" &&
                  <span
                    style={{
                      background: "#FFE0CC",
                      color: "#F2994A",
                      fontWeight: 500,
                      fontSize: 11,
                      borderRadius: 6,
                      padding: "2.5px 6px",
                      marginLeft: 8,
                      verticalAlign: "middle",
                    }}
                  >From Your Plan</span>
                }
                {item.source === "USDA" &&
                  <span
                    style={{
                      background: "#D9EBFE",
                      color: "#2D9CDB",
                      fontWeight: 500,
                      fontSize: 11,
                      borderRadius: 6,
                      padding: "2.5px 6px",
                      marginLeft: 8,
                      verticalAlign: "middle",
                    }}
                  >USDA</span>
                }
              </div>
              <div style={{ marginTop: 1, color: "#444", fontSize: 14 }}>
                Calories: {item.calories != null ? <span style={{fontWeight:500}}>{item.calories}</span> : <span style={{color: "#aaa"}}>—</span>}
              </div>
              {(item.nutrition_info && typeof item.nutrition_info === "object" && expandedIdx === idx) && (
                <div style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  background: "#f7fbfd",
                  borderRadius: 8,
                  padding: "8px 9px",
                  color: "#293",
                  margin: "4px 0"
                }}>
                  <pre style={{margin:0, padding:0, background: "none", border: "none", fontSize: 12, lineHeight: "1.2"}}>
                    {JSON.stringify(item.nutrition_info, null, 2).slice(0, 650)}...
                  </pre>
                </div>
              )}
              <div style={{ marginTop: 5, display: "flex", gap: 6 }}>
                <Button
                  onClick={() => onAddMeal && onAddMeal(item)}
                  style={{ fontSize: 14, padding: "0.32em 1.1em" }}
                >Add To Plan</Button>
                {item.nutrition_info && (
                  <Button
                    style={{
                      background: "#fae5d6",
                      color: "#F2994A",
                      border: "1px solid #edc5a1",
                      fontSize: 13,
                      fontWeight: 600,
                      marginLeft: 1
                    }}
                    onClick={() =>
                      setExpandedIdx(expandedIdx === idx ? null : idx)
                    }
                  >
                    {expandedIdx === idx ? "Hide Nutrition" : "Show Nutrition"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 15, fontSize: 13, color: "#789", textAlign: "center"
      }}>
        Suggestions improve as you plan more meals and set cuisine types!
      </div>
    </div>
  );
}

export default Recommendations;
