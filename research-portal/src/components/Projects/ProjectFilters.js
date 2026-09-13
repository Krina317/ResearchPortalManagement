import React from "react";

export default function ProjectFilters({
  filters,
  onFiltersChange,
  onClear,
  outcomeOptions = [],
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Filter Projects</h3>
          <p style={styles.subtitle}>
            Use the filters below to narrow down the projects.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          style={styles.clearButton}
        >
          Clear Filters
        </button>
      </div>

      <div style={styles.filtersGrid}>
        {/* --------------------------------------------- */}
        {/* PI */}
        {/* --------------------------------------------- */}

        <div style={styles.field}>
          <label style={styles.label}>
            Principal Investigator
          </label>

          <input
            type="text"
            name="piSearch"
            value={filters.piSearch || ""}
            onChange={handleChange}
            placeholder="Search PI name"
            style={styles.input}
          />
        </div>

        {/* --------------------------------------------- */}
        {/* CO-PI */}
        {/* --------------------------------------------- */}

        <div style={styles.field}>
          <label style={styles.label}>
            Co-Principal Investigator
          </label>

          <input
            type="text"
            name="coPiSearch"
            value={filters.coPiSearch || ""}
            onChange={handleChange}
            placeholder="Search Co-PI name"
            style={styles.input}
          />
        </div>

        {/* --------------------------------------------- */}
        {/* CATEGORY */}
        {/* --------------------------------------------- */}

        <div style={styles.field}>
          <label style={styles.label}>
            Project Category
          </label>

          <select
            name="projectCategory"
            value={filters.projectCategory || ""}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">All Categories</option>

            <option value="NU-Minor">
              NU-Minor
            </option>

            <option value="NU-Major">
              NU-Major
            </option>
          </select>
        </div>

        {/* --------------------------------------------- */}
        {/* OUTCOME */}
        {/* --------------------------------------------- */}

        <div style={styles.field}>
          <label style={styles.label}>
            Outcome of the Project
          </label>

          <select
            name="outcome"
            value={filters.outcome || ""}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">All Outcomes</option>

            {outcomeOptions.map((outcome) => (
              <option
                key={outcome}
                value={outcome}
              >
                {outcome}
              </option>
            ))}
          </select>
        </div>

        {/* --------------------------------------------- */}
        {/* AMOUNT */}
        {/* --------------------------------------------- */}

        <div style={styles.rangeSection}>
          <label style={styles.label}>
            Amount Range
          </label>

          <div style={styles.rangeInputs}>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount || ""}
              onChange={handleChange}
              placeholder="Min amount"
              min="0"
              style={styles.input}
            />

            <span style={styles.rangeSeparator}>
              to
            </span>

            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount || ""}
              onChange={handleChange}
              placeholder="Max amount"
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* DURATION */}
        {/* --------------------------------------------- */}

        <div style={styles.rangeSection}>
          <label style={styles.label}>
            Duration in Years
          </label>

          <div style={styles.rangeInputs}>
            <input
              type="number"
              name="minDuration"
              value={filters.minDuration || ""}
              onChange={handleChange}
              placeholder="Min years"
              min="0"
              step="1"
              style={styles.input}
            />

            <span style={styles.rangeSeparator}>
              to
            </span>

            <input
              type="number"
              name="maxDuration"
              value={filters.maxDuration || ""}
              onChange={handleChange}
              placeholder="Max years"
              min="0"
              step="1"
              style={styles.input}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 650,
    color: "#111827",
  },

  subtitle: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  clearButton: {
    flexShrink: 0,
    padding: "8px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "13px",
    cursor: "pointer",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  field: {
    minWidth: 0,
  },

  rangeSection: {
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "40px",
    padding: "8px 11px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "13px",
    outline: "none",
  },

  rangeInputs: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  rangeSeparator: {
    flexShrink: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
};