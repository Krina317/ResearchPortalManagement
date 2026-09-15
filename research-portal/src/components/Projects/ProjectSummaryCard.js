import React from "react";

function ProjectSummaryCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        minHeight: "120px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default ProjectSummaryCard;