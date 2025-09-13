import React from "react";

export default function MicButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "#2563eb",
        border: "none",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      🎤 Talk
    </button>
  );
} 





