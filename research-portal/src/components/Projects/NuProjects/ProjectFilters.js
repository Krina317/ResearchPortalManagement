import React from "react";

const ACADEMIC_YEARS = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

function ProjectFilters({
  filters,
  onFiltersChange,
  onClear,
  outcomeOptions = [],
}) {
  const updateFilter = (name, value) => {
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4b5563",
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "18px",
        marginBottom: "14px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
        }}
      >
        <div>
          <label style={labelStyle}>Principal Investigator</label>
          <input
            value={filters.piSearch}
            onChange={(e) =>
              updateFilter("piSearch", e.target.value)
            }
            placeholder="Search PI"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Co-Principal Investigator</label>
          <input
            value={filters.coPiSearch}
            onChange={(e) =>
              updateFilter(
                "coPiSearch",
                e.target.value
              )
            }
            placeholder="Search Co-PI"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Academic Year</label>
          <select
            value={filters.academicYear}
            onChange={(e) =>
              updateFilter(
                "academicYear",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">All Academic Years</option>

            {ACADEMIC_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Project Category</label>
          <select
            value={filters.projectCategory}
            onChange={(e) =>
              updateFilter(
                "projectCategory",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">All Categories</option>
            <option value="NU-Minor">NU-Minor</option>
            <option value="NU-Major">NU-Major</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Outcome</label>
          <select
            value={filters.outcome}
            onChange={(e) =>
              updateFilter(
                "outcome",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">All Outcomes</option>

            {outcomeOptions.map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Minimum Amount
          </label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) =>
              updateFilter(
                "minAmount",
                e.target.value
              )
            }
            placeholder="Min amount"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Maximum Amount
          </label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) =>
              updateFilter(
                "maxAmount",
                e.target.value
              )
            }
            placeholder="Max amount"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Minimum Duration
          </label>
          <input
            type="number"
            value={filters.minDuration}
            onChange={(e) =>
              updateFilter(
                "minDuration",
                e.target.value
              )
            }
            placeholder="Min years"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Maximum Duration
          </label>
          <input
            type="number"
            value={filters.maxDuration}
            onChange={(e) =>
              updateFilter(
                "maxDuration",
                e.target.value
              )
            }
            placeholder="Max years"
            style={inputStyle}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={onClear}
          style={{
            padding: "8px 15px",
            border: "1px solid #d1d5db",
            borderRadius: "7px",
            backgroundColor: "#fff",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ProjectFilters;