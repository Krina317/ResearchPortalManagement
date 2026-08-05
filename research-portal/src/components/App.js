import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UploadPage from "./Upload/UploadPage";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import ConferencePage from "./Conference/ConferencePage";

function Placeholder({ title }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">Coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
          <TopBar />
          <main className="flex-1">
              <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                      path="/conference"
                      element={<ConferencePage/>}
                  />
                  <Route
                      path="/journal"
                      element={<Placeholder title="Journal" />}
                  />
                  <Route
                      path="/book-chapters"
                      element={<Placeholder title="Book Chapters" />}
                  />
                  <Route
                      path="/upload/:publicationType"
                      element={<UploadPage />}
                  />
              </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;