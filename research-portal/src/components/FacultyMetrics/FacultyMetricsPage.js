import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import FacultyMetricsTable from "./FacultyMetricsTable";

const DUMMY_FACULTY = [
  {
    id: 1,
    name: "Dr. Faculty One",
  },
  {
    id: 2,
    name: "Dr. Faculty Two",
  },
  {
    id: 3,
    name: "Dr. Faculty Three",
  },
  {
    id: 4,
    name: "Dr. Faculty Four",
  },
];

export default function FacultyMetricsPage() {

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    setLoading(true);

    try {
      /*
       * Backend API will be connected here later.
       *
       * For now we are using dummy faculty data
       * to build and test the UI.
       */
      setFaculty(DUMMY_FACULTY);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    /*
     * Scraping API will be called here later.
     *
     * For now, simply reload the faculty list.
     */
    loadFaculty();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Faculty Metrics
          </h1>

          <p className="mt-2 text-gray-500">
            View research metrics collected from faculty web profiles
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Loading..." : "Refresh Metrics"}
        </button>

      </div>

      {/* Table */}
      <FacultyMetricsTable faculty={faculty} />

    </div>
  );
}