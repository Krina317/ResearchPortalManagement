import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  BookOpen,
  BookMarked,
  Landmark,
  HandCoins,
  Briefcase,
  FileSignature,
  BarChart3,
  FileOutput,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardSummary } from "../api/dashboardApi";

function StatCard({ label, value, icon: Icon, onClick, loading, sub, onAnalysis, onReport }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition">
      <div onClick={onClick} className="cursor-pointer flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <h2 className="text-3xl font-bold mt-2">{loading ? "..." : value}</h2>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <Icon className="text-emerald-600" size={30} />
      </div>

      {(onAnalysis || onReport) && (
        <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
          {onAnalysis && (
            <button
              onClick={onAnalysis}
              className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <BarChart3 size={15} /> Analysis
            </button>
          )}
          {onReport && (
            <button
              onClick={onReport}
              className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <FileOutput size={15} /> Generate Report
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase mb-3">
      {title}
    </h2>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    conferenceCount: 0,
    journalCount: 0,
    bookChapterCount: 0,
    externalProjectCount: 0,
    externalProjectAmount: 0,
    nuProjectCount: 0,
    nuProjectAmount: 0,
    consultancyCount: 0,
    mouCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardSummary();
  }, []);

  const loadDashboardSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDashboardSummary();
      setDashboardData({
        conferenceCount: data.conferenceCount ?? 0,
        journalCount: data.journalCount ?? 0,
        bookChapterCount: data.bookChapterCount ?? 0,
        externalProjectCount: data.externalProjectCount ?? 0,
        externalProjectAmount: data.externalProjectAmount ?? 0,
        nuProjectCount: data.nuProjectCount ?? 0,
        nuProjectAmount: data.nuProjectAmount ?? 0,
        consultancyCount: data.consultancyCount ?? 0,
        mouCount: data.mouCount ?? 0,
      });
    } catch (err) {
      console.error(err);
      setError("Server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (val) =>
    val ? `₹${Number(val).toLocaleString("en-IN")}` : "₹0";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Nirma IQAC Activity Portal
        </h1>
        <p className="mt-2 text-gray-500">
          Centralized tracking for institutional research, funding, and outreach activity
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-700">
          {error} Showing default values.
        </div>
      )}

      {/* Publications */}
      <div className="mb-8">
        <SectionHeader title="Publications" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard
            label="Conference Papers"
            value={dashboardData.conferenceCount}
            icon={FileSpreadsheet}
            loading={loading}
            onClick={() => navigate("/conference")}
            onAnalysis={() => navigate("/conference/analysis")}
            onReport={() => navigate("/conference/report")}
          />
          <StatCard
            label="Journal Papers"
            value={dashboardData.journalCount}
            icon={BookOpen}
            loading={loading}
            onClick={() => navigate("/journal")}
            onAnalysis={() => navigate("/journal/analysis")}
            onReport={() => navigate("/journal/report")}
          />
          <StatCard
            label="Book Chapters"
            value={dashboardData.bookChapterCount}
            icon={BookMarked}
            loading={loading}
            onClick={() => navigate("/book-chapters")}
            onAnalysis={() => navigate("/book-chapters/analysis")}
            onReport={() => navigate("/book-chapters/report")}
          />
        </div>
      </div>

      {/* Projects & Funding */}
      <div className="mb-8">
        <SectionHeader title="Projects & Funding" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="External Funded Projects"
            value={dashboardData.externalProjectCount}
            sub={`Total sanctioned: ${formatAmount(dashboardData.externalProjectAmount)}`}
            icon={Landmark}
            loading={loading}
            onClick={() => navigate("/projects/external")}
            onAnalysis={() => navigate("/projects/external/analysis")}
            onReport={() => navigate("/projects/external/report")}
          />
          <StatCard
            label="NU Funded Projects"
            value={dashboardData.nuProjectCount}
            sub={`Total sanctioned: ${formatAmount(dashboardData.nuProjectAmount)}`}
            icon={HandCoins}
            loading={loading}
            onClick={() => navigate("/projects/nu")}
            onAnalysis={() => navigate("/projects/nu/analysis")}
            onReport={() => navigate("/projects/nu/report")}
          />
        </div>
      </div>

      {/* Institutional Engagements */}
      <div className="mb-8">
        <SectionHeader title="Institutional Engagements" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="Consultancy"
            value={dashboardData.consultancyCount}
            icon={Briefcase}
            loading={loading}
            onClick={() => navigate("/consultancy")}
            onAnalysis={() => navigate("/consultancy/analysis")}
            onReport={() => navigate("/consultancy/report")}
          />
          <StatCard
            label="MoUs"
            value={dashboardData.mouCount}
            icon={FileSignature}
            loading={loading}
            onClick={() => navigate("/mou")}
            onAnalysis={() => navigate("/mou/analysis")}
            onReport={() => navigate("/mou/report")}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => navigate("/upload/conference")} className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition">
            Upload Conference CSV
          </button>
          <button onClick={() => navigate("/upload/journal")} className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition">
            Upload Journal CSV
          </button>
          <button onClick={() => navigate("/upload/book-chapters")} className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition">
            Upload Book Chapters CSV
          </button>
          <button onClick={() => navigate("/projects/external/add")} className="bg-white border border-emerald-600 text-emerald-700 rounded-lg py-3 hover:bg-emerald-50 transition">
            Add External Project
          </button>
          <button onClick={() => navigate("/projects/nu/add")} className="bg-white border border-emerald-600 text-emerald-700 rounded-lg py-3 hover:bg-emerald-50 transition">
            Add NU Project
          </button>
        </div>
      </div>
    </div>
  );
}