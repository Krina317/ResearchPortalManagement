import { useState } from "react";
import FileUpload from './FileUpload';
import FilterBar from "./FilterBar";
import Toolbar from "./ToolBar";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { filterData, getDistinctValues } from "../utils/filterUtils";
import { sortData } from "../utils/sortUtils";
import { analyzeColumns } from "../utils/columnAnalyzer";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const visibleColumns = columns.filter(col => selectedColumns.includes(col));
  const filterMetadata = analyzeColumns(visibleColumns, data);
  const filteredData = filterData(data, filterMetadata, filters);
  const sortedData = sortData(filteredData, sortColumn, sortDirection);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pagedData = sortedData.slice(startIndex, startIndex + rowsPerPage);
  // const handleCheckboxChange = (column) => {
  //   setSelectedColumns((prev) =>
  //       prev.includes(column)
  //           ? prev.filter(c => c !== column)
  //           : [...prev, column]
  //     );
  // };
  return (
        <div className="App">
            <header className="app-header">
                <div className="app-eyebrow">Research Data Explorer</div>
                <h1>Records</h1>
                <p className="app-subtitle">
                    Upload a spreadsheet to browse, filter, and export.
                </p>
            </header>

            <div className="container">
                <section className="card">
                    <p className="card-label">Dataset</p>
                    <FileUpload
                        setData={setData}
                        setColumns={setColumns}
                        setSelectedColumns={setSelectedColumns}
                    />
                </section>

                {columns.length > 0 && (
                    <section className="card">
                        <p className="card-label">Filters</p>
                        <FilterBar
                            filterMetadata = {filterMetadata}
                            data={data}
                            filters={filters}
                            setFilters={setFilters}
                            getDistinctValues={(column) =>
                              getDistinctValues(data, column)
                            }
                        />
                    </section>
                )}

                <section className="card">
                    <p className="card-label">Records</p>
                    <Toolbar
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        data={data}
                        filteredData={filteredData}
                        sortedData={sortedData}
                        visibleColumns={visibleColumns}
                        showColumnPanel={showColumnPanel}
                        setShowColumnPanel={setShowColumnPanel}
                        columns={columns}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns}
                    />
                    <DataTable
                        pagedData={pagedData}
                        visibleColumns={visibleColumns}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        setSortColumn={setSortColumn}
                        setSortDirection={setSortDirection}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </section>
            </div>
        </div>
    );
}

export default App;