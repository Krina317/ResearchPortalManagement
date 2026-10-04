import React from "react";

import ProjectsPage from "./ProjectsPage";
import { extProjectConfig } from "./projectConfigs";

function ExtProjectsPage() {
  return <ProjectsPage config={extProjectConfig} />;
}

export default ExtProjectsPage;