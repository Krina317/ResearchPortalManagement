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

const FINANCIAL_YEARS = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

const CALENDAR_YEARS = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

const STATUS_OPTIONS = [
  "Ongoing",
  "Completed",
  "Terminated",
];

const OUTCOME_OPTIONS = [
  "Journal Paper Published",
  "Conference Paper Published",
  "None",
  "Any activity performed based on research project",
];

function ExtProjectFilters({
  filters,
  onFiltersChange,
  onClear,
  outcomeOptions = OUTCOME_OPTIONS,
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
      {/* ---------------- TEXT FILTERS ---------------- */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
        }}
      >
        <div>
          <label style={labelStyle}>
            Project Title
          </label>

          <input
            value={filters.projectTitle}
            onChange={(e) =>
              updateFilter(
                "projectTitle",
                e.target.value
              )
            }
            placeholder="Search project title"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Principal Investigator
          </label>

          <input
            value={filters.piSearch}
            onChange={(e) =>
              updateFilter(
                "piSearch",
                e.target.value
              )
            }
            placeholder="Search PI"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Co-Principal Investigator
          </label>

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
          <label style={labelStyle}>
            Funding Agency
          </label>

          <input
            value={filters.fundingAgencyName}
            onChange={(e) =>
              updateFilter(
                "fundingAgencyName",
                e.target.value
              )
            }
            placeholder="Search funding agency"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ---------------- YEAR / STATUS / OUTCOME ---------------- */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginTop: "14px",
        }}
      >
        <div>
          <label style={labelStyle}>
            Academic Year
          </label>

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
            <option value="">
              All Academic Years
            </option>

            {ACADEMIC_YEARS.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Financial Year
          </label>

          <select
            value={filters.financialYear}
            onChange={(e) =>
              updateFilter(
                "financialYear",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              All Financial Years
            </option>

            {FINANCIAL_YEARS.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Calendar Year
          </label>

          <select
            value={filters.calendarYear}
            onChange={(e) =>
              updateFilter(
                "calendarYear",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              All Calendar Years
            </option>

            {CALENDAR_YEARS.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Status
          </label>

          <select
            value={filters.status}
            onChange={(e) =>
              updateFilter(
                "status",
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              All Statuses
            </option>

            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            Outcome
          </label>

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
            <option value="">
              All Outcomes
            </option>

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
      </div>

      {/* ---------------- AMOUNT / DURATION ---------------- */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginTop: "14px",
        }}
      >
        <div>
          <label style={labelStyle}>
            Minimum Sanctioned Amount
          </label>

          <input
            type="number"
            min="0"
            value={filters.minAmount}
            onChange={(e) =>
              updateFilter(
                "minAmount",
                e.target.value
              )
            }
            placeholder="Minimum amount"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Maximum Sanctioned Amount
          </label>

          <input
            type="number"
            min="0"
            value={filters.maxAmount}
            onChange={(e) =>
              updateFilter(
                "maxAmount",
                e.target.value
              )
            }
            placeholder="Maximum amount"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Minimum Duration
          </label>

          <input
            type="number"
            min="0"
            value={filters.minDuration}
            onChange={(e) =>
              updateFilter(
                "minDuration",
                e.target.value
              )
            }
            placeholder="Minimum duration"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Maximum Duration
          </label>

          <input
            type="number"
            min="0"
            value={filters.maxDuration}
            onChange={(e) =>
              updateFilter(
                "maxDuration",
                e.target.value
              )
            }
            placeholder="Maximum duration"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ---------------- CLEAR FILTERS ---------------- */}

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
            fontSize: "14px",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ExtProjectFilters;