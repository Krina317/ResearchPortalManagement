import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectPaging from "./ProjectPaging";
import ProjectFormModal from "./ProjectFormModal";
import InvitePisModal from "./InvitePIModal";

function ProjectsPage({ config }) {
  const navigate = useNavigate();
  const { api } = config;

  const [showForm, setShowForm] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshProjects = () => setRefreshKey((previous) => previous + 1);

  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setProjectToEdit(null);
  };

  // ADD or UPDATE (errors are thrown to the form, which shows them)
  const handleSaveProject = async (projectData) => {
    if (projectToEdit) {
      await api.update(projectToEdit.id, projectData);
    } else {
      await api.create(projectData);
    }

    handleCloseForm();
    refreshProjects();
  };

  // EDIT ONE ROW
  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowForm(true);
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
      await api.remove(project.id);
      refreshProjects();
    } catch (err) {
      alert(err.message || "Failed to delete project.");
    }
  };

  const handleOpenSummary = () => {
    navigate(config.summaryPath);
  };

  const handleGenerateReport = () => {
    alert("Generate Report functionality will be added later.");
  };

  // INVITE PIs
  const handleSendInvitations = async (emails) => {
    // TODO: call the invitations API here (nothing is sent yet)
    console.log(`Invitations to send for ${config.entityName}:`, emails);
  };

  return (
    <div className="projects-page box-border min-h-screen bg-gray-50 p-6">
      <ProjectPaging
        config={config}
        refreshKey={refreshKey}
        onAddProject={handleOpenAddProject}
        onInvitePis={() => setShowInvite(true)}
        onOpenSummary={handleOpenSummary}
        onGenerateReport={handleGenerateReport}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {showForm && (
        <ProjectFormModal
          entityName={config.entityName}
          fields={config.formFields}
          validate={config.validate}
          projectToEdit={projectToEdit}
          onSave={handleSaveProject}
          onClose={handleCloseForm}
        />
      )}

      {showInvite && (
        <InvitePisModal
          entityName={config.entityName}
          demoMode
          onSend={handleSendInvitations}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;