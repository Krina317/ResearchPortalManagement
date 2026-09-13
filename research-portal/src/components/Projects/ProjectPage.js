import React, { useState } from "react";
import ProjectPaging from "./ProjectPaging";
import AddProject from "./AddProject";

function ProjectsPage() {
  /*
   * ---------------------------------------------------------
   * PROJECT DATA
   * ---------------------------------------------------------
   *
   * Projects will eventually come from projectApi.js.
   *
   * For now this starts empty.
   * NO MOCK / SAMPLE DATA.
   */
  const [projects, setProjects] = useState([]);

  /*
   * ---------------------------------------------------------
   * ADD PROJECT
   * ---------------------------------------------------------
   */

  const [showAddProject, setShowAddProject] = useState(false);

  const handleOpenAddProject = () => {
    setShowAddProject(true);
  };

  const handleCloseAddProject = () => {
    setShowAddProject(false);
  };

  const handleAddProject = (newProject) => {
    /*
     * For now, add the project to local state.
     *
     * Later, this will be replaced by:
     *
     * await createNuFundedProject(newProject)
     *
     * followed by fetching the updated project list.
     */
    setProjects((previousProjects) => [
      ...previousProjects,
      newProject,
    ]);

    setShowAddProject(false);
  };

  /*
   * ---------------------------------------------------------
   * OUTCOME OPTIONS
   * ---------------------------------------------------------
   *
   * Keep this empty until the actual outcome categories
   * are finalized.
   *
   * Example later:
   *
   * const outcomeOptions = [
   *   "Published Paper",
   *   "Patent",
   *   ...
   * ];
   */
  const outcomeOptions = [];

  return (
    <div className="projects-page">

      {/* =====================================================
          PROJECT LIST
          ===================================================== */}

      <ProjectPaging
        projects={projects}
        onAddProject={handleOpenAddProject}
        outcomeOptions={outcomeOptions}
      />

      {/* =====================================================
          ADD PROJECT
          ===================================================== */}

      {showAddProject && (
        <AddProject
          onSave={handleAddProject}
          onClose={handleCloseAddProject}
        />
      )}

    </div>
  );
}

export default ProjectsPage;

