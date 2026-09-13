import React from "react";

function ProjectToolbar({
  onAddProject,
  totalProjects = 0,
}) {
  return (
    <div className="project-toolbar">

      {/* Project count */}
      <div className="project-toolbar-info">
        <h2>NU Funded Projects</h2>

        <span className="project-count">
          {totalProjects} project{totalProjects !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className="project-toolbar-actions">
        <button
          type="button"
          className="add-project-button"
          onClick={onAddProject}
        >
          + Add New Project
        </button>
      </div>

    </div>
  );
}

export default ProjectToolbar;
