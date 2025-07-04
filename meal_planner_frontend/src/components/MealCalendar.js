import React from "react";

/**
 * PUBLIC_INTERFACE
 * MealCalendar displays the user's meal plan in a calendar view.
 * Allows selecting, viewing, and navigating days/meals.
 * Accepts: meals, onSelectDay callback, selectedDate for highlighting
 */
function MealCalendar({ meals = [], onSelectDay, selectedDate }) {
  // Get current month days
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // First day of this month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Days as array (1 ... last date)
  const daysArray = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);

  // Map out which dates have meals (for quick lookup/highlight)
  const mealDates = new Set(meals.map((m) => m.date));

  // Generate date string for click/compare
  function getDateStr(dayNum) {
    return new Date(year, month, dayNum).toISOString().slice(0, 10);
  }

  return (
    <div>
      <h2>
        Meal Calendar{" "}
        <span style={{ color: "#888", fontWeight: 400, fontSize: 16 }}>
          {today.toLocaleString("default", { month: "long" })} {year}
        </span>
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6,
        marginTop: 10,
        marginBottom: 14,
        maxWidth: 390
      }}>
        {/* Days of week header */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div key={d} style={{ fontWeight: 500, color: "#89b" }}>{d}</div>
        ))}
        {/* Insert empty boxes for firstDay's day of week */}
        {Array.from({ length: firstDay.getDay() }, (_, i) => (
          <div key={"empty-" + i}></div>
        ))}
        {/* Date boxes */}
        {daysArray.map((dayNum) => {
          const dstr = getDateStr(dayNum);
          const isSel = dstr === selectedDate;
          const hasMeal = mealDates.has(dstr);
          return (
            <div
              key={dstr}
              onClick={() => onSelectDay && onSelectDay(dstr)}
              style={{
                cursor: "pointer",
                background: isSel
                  ? "#2D9CDB"
                  : hasMeal
                    ? "#27AE6044"
                    : "#f4f8fd",
                color: isSel ? "#fff" : hasMeal ? "#1A4B27" : "#555",
                borderRadius: 8,
                fontWeight: isSel ? 700 : 400,
                border: isSel ? "2px solid #27AE60" : hasMeal ? "1.5px solid #27AE60AA" : "1px solid #e5e5e5",
                boxShadow: isSel
                  ? "0 2px 7px -3px #2D9CDB50"
                  : hasMeal
                    ? "0 1px 2px #c1e3d2a8"
                    : "none",
                overflow: "hidden",
                minHeight: 36,
                minWidth: 34,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
              tabIndex={0}
              aria-label={"View meals for " + dstr}
            >
              <span>{dayNum}</span>
              {hasMeal && (
                <span style={{
                  fontSize: ".88em",
                  background: "#27AE60cc",
                  color: "#fff",
                  borderRadius: 5,
                  padding: "0 5px",
                  marginTop: 2
                }}>
                  🍽️
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MealCalendar;
