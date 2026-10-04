import React from "react";

import ProjectsPage from "./ProjectsPage";
import { nuProjectConfig } from "./projectConfigs";

function NuProjectsPage() {
  return <ProjectsPage config={nuProjectConfig} />;
}

export default NuProjectsPage;