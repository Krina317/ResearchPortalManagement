import { createProjectApi } from "./projectApi"; // adjust the path if projectApi.js lives elsewhere

// GET http://localhost:8080/api/reports/external-projects
const reportApi = createProjectApi("reports/external-projects");

export const fetchExternalProjectReport = () => reportApi.getAll();