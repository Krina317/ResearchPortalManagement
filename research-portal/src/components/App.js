import "./App.css";

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Sidebar from "./Sidebar";
import UploadPage from "./Upload/UploadPage";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import PublicationPage from "./Publication/PublicationPage";
import Footer from "./Footer";
import FacultyMetricsPage from "./FacultyMetrics/FacultyMetricsPage";
import NuProjectsPage from "./Projects/NuProjectsPage";
import ExtProjectsPage from "./Projects/ExtProjectsPage";
import JournalReportsPage from "./JournalReports/JournalReportsPage";
import ConferenceReportsPage from "./ConferenceReports/ConferenceReportsPage";
import ExternalProjectReport from "./ExternalProjectReport";
import ConsultancyPage from "./ConsultancyPage";

// Everything inside requires login; the shell (sidebar + topbar) lives here
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col bg-gray-50 min-h-screen">
        <TopBar />
        <main className="flex-1 min-w-0 w-full">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/faculty-metrics" element={<FacultyMetricsPage />} />
            <Route path="/conference" element={<PublicationPage publicationType="conference" />} />
            <Route path="/journal" element={<PublicationPage publicationType="journal" />} />
            <Route path="/book-chapters" element={<PublicationPage publicationType="book-chapters" />} />
            <Route path="/upload/:publicationType" element={<UploadPage />} />
            <Route path="/projects/nu" element={<NuProjectsPage />} />
            <Route path="/projects/ext" element={<ExtProjectsPage />} />
            <Route path="/journal/reports" element={<JournalReportsPage />} />
            <Route path="/conference/reports" element={<ConferenceReportsPage />} />
            <Route path="/projects/ext/reports" element={<ExternalProjectReport />} />
            <Route path="/consultancy" element={<ConsultancyPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;