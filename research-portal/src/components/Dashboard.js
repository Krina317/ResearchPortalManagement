import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  BookOpen,
  BookMarked,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    conferenceCount: 0,
    journalCount: 0,
    bookChapterCount: 0,
    lastUploadDate: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await fetch("http://localhost:8080/api/dashboard/summary");

      if (!response.ok) {
        throw new Error("Unable to fetch dashboard.");
      }

      const data = await response.json();

      setDashboardData({
        conferenceCount: data.conferenceCount ?? 0,
        journalCount: data.journalCount ?? 0,
        bookChapterCount: data.bookChapterCount ?? 0,
        lastUploadDate: data.lastUploadDate ?? null
      });

    }
    catch (err) {

      console.error(err);

      setDashboardData({
        conferenceCount: 0,
        journalCount: 0,
        bookChapterCount: 0,
        lastUploadDate: null
      });

      setError("Server unavailable.");

    }
    finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to the Nirma Research Data Management Portal.
        </p>

      </div>

      {error && (

        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-700">

          {error} Showing default values.

        </div>

      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div
          onClick={() => navigate("/conference")}
          className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition"
        >

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Conference Papers
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {loading ? "..." : dashboardData.conferenceCount}

              </h2>

            </div>

            <FileSpreadsheet
              className="text-emerald-600"
              size={34}
            />

          </div>

        </div>

        <div
          onClick={() => navigate("/journal")}
          className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition"
        >

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Journal Papers
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {loading ? "..." : dashboardData.journalCount}

              </h2>

            </div>

            <BookOpen
              className="text-emerald-600"
              size={34}
            />

          </div>

        </div>

        <div
          onClick={() => navigate("/book-chapters")}
          className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition"
        >

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Book Chapters
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {loading ? "..." : dashboardData.bookChapterCount}

              </h2>

            </div>

            <BookMarked
              className="text-emerald-600"
              size={34}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Last Upload
              </p>

              <h2 className="text-lg font-semibold mt-2">

                {

                  loading
                    ? "..."
                    : dashboardData.lastUploadDate
                      ? new Date(dashboardData.lastUploadDate).toLocaleDateString("en-GB")
                      : "No Uploads"

                }

              </h2>

            </div>

            <Clock
              className="text-emerald-600"
              size={34}
            />

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-lg font-semibold mb-4">

            Recent Activity

          </h2>

          <div className="space-y-4">

            <div className="border rounded-lg p-3 text-gray-500 text-sm">

              Activity will appear here once uploads begin.

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-lg font-semibold mb-4">

            Quick Actions

          </h2>

          <div className="flex flex-col gap-4">

            <button
              onClick={() => navigate("/upload/conference")}
              className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition"
            >
              Upload Conference CSV
            </button>

            <button
              onClick={() => navigate("/upload/journal")}
              className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition"
            >
              Upload Journal CSV
            </button>

            <button
              onClick={() => navigate("/upload/book-chapters")}
              className="bg-emerald-600 text-white rounded-lg py-3 hover:bg-emerald-700 transition"
            >
              Upload Book Chapters CSV
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}