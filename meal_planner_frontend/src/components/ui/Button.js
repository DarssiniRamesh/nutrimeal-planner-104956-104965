import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button - a reusable styled button for consistent look throughout the app.
 */
function Button({ children, onClick, type = "button", className = "", style = {} }) {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      type={type}
      style={{
        background: 'linear-gradient(90deg, #2D9CDB 0%, #27AE60 100%)',
        color: "#fff",
        outline: "none",
        border: "none",
        borderRadius: "7px",
        fontWeight: 600,
        padding: "0.58em 1.4em",
        boxShadow: "0 2px 7px -3px #2D9CDB30",
        cursor: "pointer",
        fontSize: "1em",
        ...style
      }}
    >
      {children}
    </button>
  );
}

export default Button;
