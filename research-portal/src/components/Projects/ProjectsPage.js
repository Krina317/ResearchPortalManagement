import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectPaging from "./ProjectPaging";
import AddProject from "./AddProject";

import {
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projectApi";

function ProjectsPage() {
  const navigate = useNavigate();

  const [showAddProject, setShowAddProject] =
    useState(false);

  const [projectToEdit, setProjectToEdit] =
    useState(null);

  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setShowAddProject(true);
  };

  const handleCloseAddProject = () => {
    setShowAddProject(false);
    setProjectToEdit(null);
  };

  // ADD or UPDATE
  const handleSaveProject = async (projectData) => {
    if (projectToEdit) {
      await updateProject(
        projectToEdit.id,
        projectData
      );
    } else {
      await createProject(projectData);
    }

    setShowAddProject(false);
    setProjectToEdit(null);

    window.location.reload();
  };

  // EDIT ONE ROW
  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowAddProject(true);
  };

  // DELETE ONE ROW
  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this project?\n\n"${project.projectTitle}"`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.id);

      window.location.reload();
    } catch (err) {
      alert(
        err.message ||
          "Failed to delete project."
      );
    }
  };

  const handleOpenSummary = () => {
    navigate("/projects/nu/summary");
  };

  const handleGenerateReport = () => {
    alert(
      "Generate Report functionality will be added later."
    );
  };

  return (
    <div
      className="projects-page"
      style={{
        padding: "24px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <ProjectPaging
        onAddProject={handleOpenAddProject}
        onOpenSummary={handleOpenSummary}
        onGenerateReport={handleGenerateReport}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {showAddProject && (
        <AddProject
          onSave={handleSaveProject}
          onClose={handleCloseAddProject}
          projectToEdit={projectToEdit}
        />
      )}
    </div>
  );
}

export default ProjectsPage;