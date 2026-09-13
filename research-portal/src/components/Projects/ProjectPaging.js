```jsx
import React, { useEffect, useMemo, useState } from "react";
import ProjectFilters from "./ProjectFilters";
import ProjectToolbar from "./ProjectToolbar";
import ProjectTable from "./ProjectTable";

const DEFAULT_FILTERS = {
  piSearch: "",
  coPiSearch: "",
  minAmount: "",
  maxAmount: "",
  projectCategory: "",
  minDuration: "",
  maxDuration: "",
  outcome: "",
};

const DEFAULT_ROWS_PER_PAGE = 10;

function ProjectPaging({
  projects = [],
  onAddProject,
  outcomeOptions = [],
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  /*
   * ---------------------------------------------------------
   * FILTERING
   * ---------------------------------------------------------
   */

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // PI search
      const piMatch =
        !filters.piSearch ||
        (project.principalInvestigator || "")
          .toLowerCase()
          .includes(filters.piSearch.toLowerCase());

      // Co-PI search
      const coPiMatch =
        !filters.coPiSearch ||
        (project.coPrincipalInvestigatorList || "")
          .toLowerCase()
          .includes(filters.coPiSearch.toLowerCase());

      // Minimum amount
      const minAmountMatch =
        filters.minAmount === "" ||
        Number(project.amount || 0) >= Number(filters.minAmount);

      // Maximum amount
      const maxAmountMatch =
        filters.maxAmount === "" ||
        Number(project.amount || 0) <= Number(filters.maxAmount);

      // Project category
      const categoryMatch =
        !filters.projectCategory ||
        project.projectCategory === filters.projectCategory;

      // Minimum duration
      const minDurationMatch =
        filters.minDuration === "" ||
        Number(project.duration || 0) >= Number(filters.minDuration);

      // Maximum duration
      const maxDurationMatch =
        filters.maxDuration === "" ||
        Number(project.duration || 0) <= Number(filters.maxDuration);

      // Outcome
      const outcomeMatch =
        !filters.outcome ||
        (project.outcomeOfResearchProject || "")
          .toLowerCase()
          .includes(filters.outcome.toLowerCase());

      return (
        piMatch &&
        coPiMatch &&
        minAmountMatch &&
        maxAmountMatch &&
        categoryMatch &&
        minDurationMatch &&
        maxDurationMatch &&
        outcomeMatch
      );
    });
  }, [projects, filters]);

  /*
   * ---------------------------------------------------------
   * PAGINATION
   * ---------------------------------------------------------
   */

  const totalProjects = filteredProjects.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProjects / rowsPerPage)
  );

  // Make sure current page never goes beyond the last page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentProjects = filteredProjects.slice(
    startIndex,
    endIndex
  );

  /*
   * ---------------------------------------------------------
   * FILTER HANDLERS
   * ---------------------------------------------------------
   */

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  /*
   * ---------------------------------------------------------
   * PAGINATION HANDLERS
   * ---------------------------------------------------------
   */

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages)
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  /*
   * ---------------------------------------------------------
   * PAGE NUMBERS
   * ---------------------------------------------------------
   */

  const pageNumbers = [];

  for (let page = 1; page <= totalPages; page++) {
    pageNumbers.push(page);
  }

  /*
   * ---------------------------------------------------------
   * DISPLAY RANGE
   * ---------------------------------------------------------
   */

  const displayStart =
    totalProjects === 0 ? 0 : startIndex + 1;

  const displayEnd =
    totalProjects === 0
      ? 0
      : Math.min(endIndex, totalProjects);

  return (
    <div className="project-paging">

      {/* Toolbar */}
      <ProjectToolbar
        onAddProject={onAddProject}
        totalProjects={totalProjects}
      />

      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
        outcomeOptions={outcomeOptions}
      />

      {/* Result count */}
      <div className="project-result-info">
        Showing {displayStart}-{displayEnd} of {totalProjects} projects
      </div>

      {/* Table */}
      <ProjectTable projects={currentProjects} />

      {/* Pagination */}
      {totalProjects > 0 && (
        <div className="project-pagination">

          {/* Rows per page */}
          <div className="rows-per-page">
            <label htmlFor="rowsPerPage">
              Rows per page:
            </label>

            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page navigation */}
          <div className="page-navigation">

            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={
                  currentPage === pageNumber
                    ? "active"
                    : ""
                }
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPaging;
```
