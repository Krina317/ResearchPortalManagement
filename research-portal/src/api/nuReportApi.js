import { createProjectApi } from "./projectApi"; // adjust the path if needed

// GET http://localhost:8080/api/reports/nu-projects
const reportApi = createProjectApi("reports/nu-projects");

export const fetchNuProjectReport = () => reportApi.getAll();