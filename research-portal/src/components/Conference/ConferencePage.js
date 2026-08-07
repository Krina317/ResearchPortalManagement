import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import ConferenceHeader from "./ConferenceHeader";
import ConferenceToolbar from "./ConferenceToolbar";
import ConferenceFilter from "./ConferenceFilter";
import ConferenceTable from "./ConferenceTable";
import Pagination from "../Pagination";
import { searchConferences, fetchAllMatchingConferences } from "../../api/conferenceApi";

const DEFAULT_FILTERS = {
    conferenceName: "",
    paperTitle: "",
    conferenceType: "All",
    departments: [],
    instituteName: "All",
    authorName: "",
    authorPositions: [],
    fromDate: "",
    toDate: "",
    academicYear: "",
    financialYear: "",
    calendarYear: ""
};

const PAGE_SIZE = 10;

export default function ConferencePage() {

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedColumns, setSelectedColumns] = useState(null);
    const [mergeAuthors, setMergeAuthors] = useState(true);
    const [exporting, setExporting] = useState(false);

    const loadData = useCallback(async () => {

        setLoading(true);
        setError("");

        try {
            const result = await searchConferences(appliedFilters, {
                page,
                size: PAGE_SIZE,
                sortBy: "fromDate",
                sortDir: "DESC"
            });
            setData(result);
        } catch (err) {
            console.error(err);
            setError("Could not load conference records. Is the backend running?");
            setData(null);
        } finally {
            setLoading(false);
        }

    }, [appliedFilters, page]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleApplyFilters(){
        setPage(0);
        setAppliedFilters(filters);
    }

    function handleResetFilters(){
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setPage(0);
    }

    async function handleExport(){

        setExporting(true);

        try {

            const allRecords = await fetchAllMatchingConferences(appliedFilters);

            if (allRecords.length === 0) {
                alert("No records match the current filters to export.");
                return;
            }

            const exportRows = allRecords.map(record => {

                const row = {
                    "ID": record.id,
                    "Conference": record.conferenceName,
                    "Paper Title": record.paperTitle,
                    "Type": record.conferenceType,
                    "Department": record.deptCode,
                    "Institute": record.instituteName,
                    "From Date": record.fromDate,
                    "To Date": record.toDate
                };

                if (mergeAuthors) {
                    row["Authors"] = record.authorsMerged;
                } else {
                    (record.authors ?? []).forEach((author, i) => {
                        row[`Author ${i + 1}`] = author.displayName;
                    });
                }

                return row;

            });

            const filteredRows = selectedColumns
                ? exportRows.map(row => {
                      const filtered = {};
                      Object.keys(row).forEach(key => {
                          if (selectedColumns.includes(key)) {
                              filtered[key] = row[key];
                          }
                      });
                      return filtered;
                  })
                : exportRows;

            const worksheet = XLSX.utils.json_to_sheet(filteredRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Conference Papers");

            const timestamp = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `conference-papers-${timestamp}.xlsx`);

        } catch (err) {
            console.error(err);
            alert("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }

    }

    return (
        <div className="px-8 py-6 bg-gray-50 min-h-screen">

            <ConferenceHeader />

            <ConferenceToolbar
                selectedColumns={selectedColumns}
                onColumnsChange={setSelectedColumns}
                onExport={handleExport}
                exporting={exporting}
            />

            <ConferenceFilter
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                mergeAuthors={mergeAuthors}
                onMergeAuthorsChange={setMergeAuthors}
            />

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            <ConferenceTable
                records={data?.content ?? []}
                loading={loading}
                totalElements={data?.totalElements ?? 0}
                selectedColumns={selectedColumns}
                mergeAuthors={mergeAuthors}
            />

            <Pagination
                page={page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={setPage}
            />

        </div>
    );
}