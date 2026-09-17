import React from "react";

function ExtProjectToolbar({
  onAddProject,
  onOpenSummary,
  onGenerateReport,
  totalProjects = 0,
}) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "18px 20px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            color: "#1f2937",
          }}
        >
          External Funded Projects
        </h2>

        <span
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          {totalProjects} project
          {totalProjects !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onOpenSummary}
          style={{
            padding: "10px 16px",
            borderRadius: "7px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            color: "#374151",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          View Summary
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          style={{
            padding: "10px 16px",
            borderRadius: "7px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            color: "#374151",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Generate Report
        </button>

        <button
          type="button"
          onClick={onAddProject}
          style={{
            padding: "10px 16px",
            borderRadius: "7px",
            border: "none",
            backgroundColor: "#059669",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add New Project
        </button>
      </div>
    </div>
  );
}

export default ExtProjectToolbar;