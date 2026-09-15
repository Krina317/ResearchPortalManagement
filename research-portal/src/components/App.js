import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import UploadPage from "./Upload/UploadPage";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import PublicationPage from "./Publication/PublicationPage";

import ProjectsPage from "./Projects/ProjectsPage";
import ProjectSummaryPage from "./Projects/ProjectSummaryPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col bg-gray-50 min-h-screen">
          <TopBar />

          <main className="flex-1 min-w-0 w-full">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/conference"
                element={
                  <PublicationPage publicationType="conference" />
                }
              />

              <Route
                path="/journal"
                element={
                  <PublicationPage publicationType="journal" />
                }
              />

              <Route
                path="/book-chapters"
                element={
                  <PublicationPage publicationType="book-chapters" />
                }
              />

              <Route
                path="/upload/:publicationType"
                element={<UploadPage />}
              />

              <Route
                path="/projects/nu"
                element={<ProjectsPage />}
              />

              <Route
                path="/projects/nu/summary"
                element={<ProjectSummaryPage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;