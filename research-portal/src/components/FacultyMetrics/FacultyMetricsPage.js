import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import FacultyMetricsTable from "./FacultyMetricsTable";
import { fetchFacultyList, scrapeFacultyMetrics } from "./facultyMetricsApi";

export default function FacultyMetricsPage() {
  const [faculty, setFaculty] = useState([]);
  const [metrics, setMetrics] = useState({}); // { [facultyId]: { status, citations, hIndex, i10Index } }
  const [loadingList, setLoadingList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    setLoadingList(true);
    setError("");
    try {
      setFaculty(await fetchFacultyList());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const results = await scrapeFacultyMetrics();
      setMetrics(Object.fromEntries(results.map((r) => [r.facultyId, r])));
      setFetchedAt(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  const okCount = Object.values(metrics).filter((m) => m.status === "OK").length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Faculty Metrics</h1>
          <p className="mt-2 text-gray-500">
            View research metrics collected from faculty web profiles
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loadingList}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Fetching..." : "Refresh Metrics"}
        </button>
      </div>

      {/* Status messages */}
      {refreshing && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 text-sm">
          Fetching metrics from Google Scholar. This can take around a minute.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {fetchedAt && !refreshing && (
        <p className="mb-3 text-sm text-gray-500">
          Metrics fetched for {okCount} faculty at {fetchedAt.toLocaleTimeString()}
        </p>
      )}

      {/* Table */}
      <FacultyMetricsTable faculty={faculty} metrics={metrics} />
    </div>
  );
}