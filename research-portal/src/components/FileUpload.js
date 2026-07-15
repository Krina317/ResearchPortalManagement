import { useState } from "react";
import * as XLSX from "xlsx";

const FileUpload = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showColumnPanel, setShowColumnPanel] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const rawData = event.target.result;
            const workbook = XLSX.read(rawData, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setData(jsonData);
            const extractedColumns = Object.keys(jsonData[0]).filter(col => col !== "Download File");
            setColumns(extractedColumns);
            setSelectedColumns(extractedColumns);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleCheckboxChange = (col) => {
        setSelectedColumns((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
        );
    };

    const handleFilterChange = (col, value) => {
        setFilters((prev) => ({ ...prev, [col]: value }));
        setCurrentPage(1); // reset to page 1 whenever a filter changes
    };

    const handleSort = (col) => {
        if (sortColumn === col) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    const visibleColumns = columns.filter((col) => selectedColumns.includes(col));

    // --- filtering ---
    const filteredData = data.filter((row) =>
        visibleColumns.every((col) => {
            const filterValue = filters[col];
            if (!filterValue) return true; // no filter set for this column, don't exclude
            return String(row[col] ?? "")
                .toLowerCase()
                .includes(filterValue.toLowerCase());
        })
    );

    // --- sorting ---
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;
        const valA = a[sortColumn] ?? "";
        const valB = b[sortColumn] ?? "";
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // --- paging ---
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const pagedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            {/* Myntra-style column filter panel */}
            <div style={{ margin: "10px 0" }}>
                <button onClick={() => setShowColumnPanel((prev) => !prev)}>
                    Columns ▾
                </button>
                {showColumnPanel && (
                    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "5px" }}>
                        {columns.map((col) => (
                            <label key={col} style={{ display: "block", marginBottom: "4px" }}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(col)}
                                    onChange={() => handleCheckboxChange(col)}
                                />
                                {col}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* per-column filter inputs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                {visibleColumns.map((col) => (
                    <input
                        key={col}
                        placeholder={`Filter ${col}`}
                        value={filters[col] || ""}
                        onChange={(e) => handleFilterChange(col, e.target.value)}
                    />
                ))}
            </div>

            {/* rows-per-page dropdown */}
            <label>
                Rows per page:{" "}
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </label>

            <table border="1" style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        {visibleColumns.map((col) => (
                            <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                                {col} {sortColumn === col ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pagedData.map((row, i) => (
                        <tr key={i}>
                            {visibleColumns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* pagination controls */}
            <div style={{ marginTop: "10px" }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    Prev
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default FileUpload;