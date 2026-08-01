import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

const publicationTypes = [
  { value: "conference", label: "Conference" },
  { value: "journal", label: "Journal" },
  { value: "bookChapters", label: "Book Chapters" },
];

const ROWS_PER_PAGE = 10;

const excelSerialToDate = (serial) => {
  // Excel's epoch starts Dec 30, 1899
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return dateInfo;
};

const formatDate = (value) => {
  if (!value) return "";

  // Already a JS Date (thanks to cellDates:true)
  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB"); // DD/MM/YYYY
  }

  // Leftover numeric serial (fallback safety net)
  if (typeof value === "number") {
    return excelSerialToDate(value).toLocaleDateString("en-GB");
  }

  // Already a string like "13/07/2025"
  return value;
};

const normalizeRow = (row) => {
  const normalized = { ...row };
  Object.keys(normalized).forEach((key) => {
    if (key.toLowerCase().includes("date")) {
      normalized[key] = formatDate(normalized[key]);
    }
  });
  return normalized;
};

export default function UploadPage() {
  const [pubType, setPubType] = useState("conference");
  const [fileName, setFileName] = useState(null);
  const [uploadedRows, setUploadedRows] = useState([]);
  const [dbRows, setDbRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Placeholder — replace with real API call once backend is ready
  const fetchExistingRecords = async (type) => {
    setLoading(true);
    try {
      // const res = await fetch(`/api/${type}`);
      // const data = await res.json();
      // setDbRows(data);
      setDbRows([]); // stub for now
    } catch (err) {
      console.error("Failed to fetch existing records", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing DB records whenever publication type changes
  useEffect(() => {
    fetchExistingRecords(pubType);
    setCurrentPage(1);
  }, [pubType]);

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFileName(file.name);

  const reader = new FileReader();
  reader.onload = (evt) => {
    const workbook = XLSX.read(evt.target.result, {
      type: "binary",
      cellDates: true, // parse date cells as JS Date objects instead of numbers
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

    if (json.length > 0) {
      setColumns(Object.keys(json[0]));
      setUploadedRows(json.map(normalizeRow));
      setCurrentPage(1);
    }
  };
  reader.readAsBinaryString(file);
};

  const handleUpdate = () => {
    // Backend save call goes here later
    console.log("Update clicked", { pubType, uploadedRows });
  };

  // Merge DB rows + newly uploaded rows, sort by most recent
  // Assumes each row has a date-like field — adjust key name once you share DB schema
  const allRows = [...uploadedRows, ...dbRows];
  const sortedRows = [...allRows].sort((a, b) => {
    const dateA = new Date(a.Date || a.date || 0);
    const dateB = new Date(b.Date || b.date || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const pagedRows = sortedRows.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const displayColumns =
    columns.length > 0
      ? columns
      : dbRows.length > 0
      ? Object.keys(dbRows[0])
      : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Upload File
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Upload a spreadsheet and select the publication type before saving.
      </p>

      {/* Top controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={pubType}
          onChange={(e) => setPubType(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {publicationTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          disabled={uploadedRows.length === 0}
          className="px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Update
        </button>
      </div>

      {/* Upload box */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-10 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
      >
        <UploadCloud size={28} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          Click to upload .xls / .xlsx file
        </span>
        {fileName && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1">
            <FileSpreadsheet size={14} />
            {fileName}
          </span>
        )}
        <input
          id="file-upload"
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-gray-400 mt-8">Loading existing records...</p>
      ) : (
        sortedRows.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {sortedRows.length} record{sortedRows.length !== 1 && "s"} — sorted by most recent
            </p>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {displayColumns.map((col) => (
                      <th
                        key={col}
                        className="text-left px-4 py-2.5 font-medium text-gray-500 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      {displayColumns.map((col) => (
                        <td key={col} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}