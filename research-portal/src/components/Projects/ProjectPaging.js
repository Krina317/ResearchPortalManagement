import React, { useEffect, useState } from "react";
import ProjectFilters from "./ProjectFilters";
import ProjectToolbar from "./ProjectToolbar";
import ProjectTable from "./ProjectTable";
import { fetchProjectsWithFilters } from "../../api/projectApi";

const DEFAULT_FILTERS = {
  piSearch: "",
  coPiSearch: "",
  minAmount: "",
  maxAmount: "",
  projectCategory: "",
  minDuration: "",
  maxDuration: "",
  academicYear: "",
  outcome: "",
};

const DEFAULT_ROWS_PER_PAGE = 10;

const OUTCOME_OPTIONS = [
  "Journal Paper Published",
  "Conference Paper Published",
  "None",
  "Any activity performed based on research project",
];

function ProjectPaging({
    onAddProject,
    onOpenSummary,
    onGenerateReport,
    onEditProject,
    onDeleteProject,
}) {
  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [projects, setProjects] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(
    DEFAULT_ROWS_PER_PAGE
  );

  const [totalProjects, setTotalProjects] =
    useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("id");

  const [direction, setDirection] =
    useState("asc");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchProjectsWithFilters({
        pi: filters.piSearch,
        coPi: filters.coPiSearch,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        projectCategory:
          filters.projectCategory,
        minDuration: filters.minDuration,
        maxDuration: filters.maxDuration,
        academicYear: filters.academicYear,
        outcome: filters.outcome,
        page: currentPage - 1,
        size: rowsPerPage,
        sortBy,
        direction,
      });

      setProjects(data.content || []);

      setTotalProjects(
        data.totalElements || 0
      );

      setTotalPages(
        Math.max(1, data.totalPages || 1)
      );

    } catch (err) {

      setError(
        err.message ||
        "Failed to load projects."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadProjects();
  }, [
    filters,
    currentPage,
    rowsPerPage,
    sortBy,
    direction,
  ]);

  // ---------------------------------------------------------
  // FILTERS
  // ---------------------------------------------------------

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // ---------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------

  const handlePreviousPage = () => {
    setCurrentPage((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((previous) =>
      Math.min(previous + 1, totalPages)
    );
  };

  const handleRowsPerPageChange = (event) => {
    const value = event.target.value;

    // Allow the input to temporarily be empty
    if (value === "") {
      setRowsPerPage("");
      return;
    }

    const number = Number(value);

    if (number >= 1) {
      setRowsPerPage(number);
      setCurrentPage(1);
    }
  };

  const handleRowsPerPageBlur = () => {
    // If the user leaves the field empty,
    // restore the default value.
    if (
      rowsPerPage === "" ||
      Number(rowsPerPage) < 1
    ) {
      setRowsPerPage(
        DEFAULT_ROWS_PER_PAGE
      );

      setCurrentPage(1);
    }
  };

  // ---------------------------------------------------------
  // SORTING
  // ---------------------------------------------------------

  const handleSort = (field) => {

    if (
      field !== "id" &&
      field !== "amount"
    ) {
      return;
    }

    if (sortBy === field) {

      setDirection((previous) =>
        previous === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortBy(field);
      setDirection("asc");

    }

    setCurrentPage(1);
  };

  // ---------------------------------------------------------
  // DISPLAY RANGE
  // ---------------------------------------------------------

  const displayStart =
    totalProjects === 0
      ? 0
      : (currentPage - 1) *
          (Number(rowsPerPage) || 1) +
        1;

  const displayEnd =
    totalProjects === 0
      ? 0
      : Math.min(
          currentPage *
            (Number(rowsPerPage) || 1),
          totalProjects
        );

  return (
    <div className="project-paging">

      {/* --------------------------------------------------- */}
      {/* TOOLBAR */}
      {/* --------------------------------------------------- */}

      <ProjectToolbar
        onAddProject={onAddProject}
        onOpenSummary={onOpenSummary}
        onGenerateReport={onGenerateReport}
        totalProjects={totalProjects}
      />

      {/* --------------------------------------------------- */}
      {/* FILTERS */}
      {/* --------------------------------------------------- */}

      <ProjectFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
        outcomeOptions={OUTCOME_OPTIONS}
      />

      {/* --------------------------------------------------- */}
      {/* ERROR */}
      {/* --------------------------------------------------- */}

      {error && (
        <div
          style={{
            marginBottom: "14px",
            padding: "12px",
            borderRadius: "7px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* PAGINATION CONTROLS */}
      {/* ABOVE TABLE */}
      {/* --------------------------------------------------- */}

      <div
        style={{
          marginBottom: "14px",
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >

        {/* Showing records */}
        <div
          style={{
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Showing{" "}
          <strong>
            {displayStart}-{displayEnd}
          </strong>{" "}
          of{" "}
          <strong>
            {totalProjects}
          </strong>{" "}
          projects
        </div>

        {/* Right-side controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >

          {/* Rows per page */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            <label htmlFor="rowsPerPage">
              Rows per page:
            </label>

            <input
              id="rowsPerPage"
              type="number"
              min="1"
              value={rowsPerPage}
              onChange={
                handleRowsPerPageChange
              }
              onBlur={
                handleRowsPerPageBlur
              }
              style={{
                width: "70px",
                padding: "7px 9px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>

          {/* Previous / Page / Next */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >

            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                currentPage === 1 ||
                totalProjects === 0
              }
              style={paginationButtonStyle(
                currentPage === 1 ||
                  totalProjects === 0
              )}
            >
              Previous
            </button>

            <span
              style={{
                padding: "0 10px",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                currentPage ===
                  totalPages ||
                totalProjects === 0
              }
              style={paginationButtonStyle(
                currentPage ===
                  totalPages ||
                  totalProjects === 0
              )}
            >
              Next
            </button>

          </div>
        </div>
      </div>

      {/* --------------------------------------------------- */}
      {/* TABLE */}
      {/* --------------------------------------------------- */}

      {loading ? (

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "40px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Loading projects...
        </div>

      ) : (

        <ProjectTable
        projects={projects}
        sortBy={sortBy}
        direction={direction}
        onSort={handleSort}
        onEdit={onEditProject}
        onDelete={onDeleteProject}
        />

      )}

    </div>
  );
}

const paginationButtonStyle = (
  disabled
) => ({
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  backgroundColor: "#fff",
  cursor: disabled
    ? "not-allowed"
    : "pointer",
  opacity: disabled ? 0.5 : 1,
});

export default ProjectPaging;