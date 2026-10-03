import React from "react";

const secondaryButtonClass =
  "cursor-pointer rounded-[7px] border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50";

function ProjectToolbar({
  title,
  totalProjects = 0,
  onAddProject,
  onOpenSummary,
  onGenerateReport,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-gray-200 bg-white px-5 py-[18px]">
      <div>
        <h2 className="m-0 text-xl font-bold text-gray-800">{title}</h2>

        <span className="mt-1 block text-sm text-gray-500">
          {totalProjects} project{totalProjects !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onOpenSummary}
          className={secondaryButtonClass}
        >
          View Summary
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          className={secondaryButtonClass}
        >
          Generate Report
        </button>

        <button
          type="button"
          onClick={onAddProject}
          className="cursor-pointer rounded-[7px] border-none bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          + Add New Project
        </button>
      </div>
    </div>
  );
}

export default ProjectToolbar;