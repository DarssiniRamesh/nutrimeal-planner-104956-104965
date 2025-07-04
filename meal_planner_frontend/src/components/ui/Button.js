import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button - a reusable styled button for consistent look throughout the app.
 */
function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default Button;
