import React, { useEffect, useState } from "react";

import ProjectFilters from "./ProjectFilters";
import ProjectToolbar from "./ProjectToolbar";
import ProjectTable from "./ProjectTable";
import { downloadProjects } from "./projectExport";

const DEFAULT_ROWS_PER_PAGE = 10;

const paginationButtonClass =
  "rounded-md border border-gray-300 bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white";

function ProjectPaging({
    config,
    refreshKey,
    onAddProject,
    onInvitePis,
    onOpenSummary,
    onGenerateReport,
    onEditProject,
    onDeleteProject,
}) {
  const {
    api,
    title,
    columns,
    defaultFilters,
    filterGroups,
    toQueryParams,
    tableMinWidth,
  } = config;

  // draftFilters   = what is typed in the filter boxes
  // appliedFilters = what the table is actually using (set by "Apply Filters")
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  // keys of the columns currently shown (all columns by default)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() =>
    columns.map((column) => column.key)
  );

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const activeFilterCount = Object.values(appliedFilters).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  // columns in their original order, only the ones that are selected
  const visibleColumns = columns.filter((column) =>
    visibleColumnKeys.includes(column.key)
  );
  const allColumnsVisible = visibleColumns.length === columns.length;

  // =========================================================
  // LOAD PROJECTS (paging + sorting + filtering are done by the backend)
  // =========================================================

    // =========================================================
  // LOAD PROJECTS (paging + sorting + filtering are done by the backend)
  // Reloads when applied filters / pagination / sorting change,
  // or when the page asks for a refresh (after add / edit / delete)
  // =========================================================

  useEffect(() => {
    let ignore = false; // set when a newer request replaces this one

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.fetchWithFilters({
          params: toQueryParams(appliedFilters),
          page: currentPage - 1,
          size: Number(rowsPerPage) || DEFAULT_ROWS_PER_PAGE,
          sortBy,
          direction,
        });

        if (ignore) return;

        setProjects(data.content || []);
        setTotalProjects(data.totalElements || 0);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } catch (err) {
        if (ignore) return;

        console.error(`Error loading ${title}:`, err);

        setError(err.message || "Failed to load projects.");
        setProjects([]);
        setTotalProjects(0);
        setTotalPages(1);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      ignore = true;
    };
  }, [
    api,
    title,
    toQueryParams,
    appliedFilters,
    currentPage,
    rowsPerPage,
    sortBy,
    direction,
    refreshKey,
  ]);
  // =========================================================
  // DOWNLOAD (all pages, applied filters, current sort, visible columns)
  // =========================================================

  const handleDownload = async (format) => {
    try {
      setExporting(true);
      setError("");

      const allProjects = await api.fetchAllWithFilters({
        params: toQueryParams(appliedFilters),
        sortBy,
        direction,
      });

      if (allProjects.length === 0) {
        setError("There are no projects to download.");
        return;
      }

      downloadProjects({
        format,
        projects: allProjects,
        columns: visibleColumns,
        fileName: config.exportFileName,
        title,
      });
    } catch (err) {
      setError(err.message || "Failed to download projects.");
    } finally {
      setExporting(false);
    }
  };

  // =========================================================
  // FILTERS
  // =========================================================

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  // =========================================================
  // COLUMN SELECTOR
  // =========================================================

  const handleToggleColumn = (key) => {
    setVisibleColumnKeys((previous) => {
      if (previous.includes(key)) {
        // keep at least one column selected
        return previous.length === 1
          ? previous
          : previous.filter((existing) => existing !== key);
      }

      return [...previous, key];
    });
  };

  const handleSelectAllColumns = () => {
    setVisibleColumnKeys(columns.map((column) => column.key));
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
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
    // Restore default if input is left empty
    if (rowsPerPage === "" || Number(rowsPerPage) < 1) {
      setRowsPerPage(DEFAULT_ROWS_PER_PAGE);
      setCurrentPage(1);
    }
  };

  // =========================================================
  // SORTING
  // =========================================================

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setDirection("asc");
    }

    setCurrentPage(1);
  };

  // =========================================================
  // DISPLAY RANGE
  // =========================================================

  const pageSize = Number(rowsPerPage) || 1;

  const displayStart =
    totalProjects === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const displayEnd =
    totalProjects === 0 ? 0 : Math.min(currentPage * pageSize, totalProjects);

  const previousDisabled = currentPage === 1 || totalProjects === 0 || loading;

  const nextDisabled =
    currentPage === totalPages || totalProjects === 0 || loading;

  return (
    <div className="project-paging">
      <ProjectToolbar
        title={title}
        totalProjects={totalProjects}
        exporting={exporting}
        onAddProject={onAddProject}
        onInvitePis={onInvitePis}
        onOpenSummary={onOpenSummary}
        onGenerateReport={onGenerateReport}
        onDownload={handleDownload}
      />

      <ProjectFilters
        filters={draftFilters}
        groups={filterGroups}
        activeCount={activeFilterCount}
        columns={columns}
        visibleColumnKeys={visibleColumnKeys}
        onFiltersChange={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onToggleColumn={handleToggleColumn}
        onSelectAllColumns={handleSelectAllColumns}
      />

      {error && (
        <div className="mb-3.5 rounded-[7px] border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* PAGINATION CONTROLS ABOVE TABLE */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <strong>
            {displayStart}-{displayEnd}
          </strong>{" "}
          of <strong>{totalProjects}</strong> projects
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="rowsPerPage">Rows per page:</label>

            <input
              id="rowsPerPage"
              type="number"
              min="1"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              onBlur={handleRowsPerPageBlur}
              className="w-[70px] rounded-md border border-gray-300 px-[9px] py-[7px] text-center outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={previousDisabled}
              className={paginationButtonClass}
            >
              Previous
            </button>

            <span className="px-2.5 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={nextDisabled}
              className={paginationButtonClass}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="rounded-[10px] border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading projects...
        </div>
      ) : (
        <ProjectTable
          columns={visibleColumns}
          projects={projects}
          sortBy={sortBy}
          direction={direction}
          tableMinWidth={allColumnsVisible ? tableMinWidth : ""}
          onSort={handleSort}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
        />
      )}
    </div>
  );
}

export default ProjectPaging;