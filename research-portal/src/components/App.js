import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UploadPage from "./UploadPage";

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
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/conference" element={<Placeholder title="Conference" />} />
            <Route path="/journal" element={<Placeholder title="Journal" />} />
            <Route path="/book-chapters" element={<Placeholder title="Book Chapters" />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;