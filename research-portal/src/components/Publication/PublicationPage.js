import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";

import {
    getPublicationConfig
} from "../../config/publicationConfig";

import {
    searchPublication,
    fetchAllMatchingPublication
} from "../../api/publicationApi";

import PublicationHeader from "./PublicationHeader";
import PublicationToolbar from "./PublicationToolbar";
import PublicationFilter from "./PublicationFilter";
import PublicationTable from "./PublicationTable";
import PublicationPagination from "./PublicationPagination";


const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];


/*
|--------------------------------------------------------------------------
| Static dropdown options
|--------------------------------------------------------------------------
| There's no backend endpoint yet that returns distinct values for
| institute / conference type / journal type / publication type / city,
| so PublicationFilter's dropdowns were always empty (the `options` prop
| was never even being passed in before this fix).
|
| Hardcoded from what's actually in the uploaded data for now - swap this
| out for a real "/api/{type}/distinct-values" endpoint later so these
| stay correct as new institutes/types get added.
|--------------------------------------------------------------------------
*/
const STATIC_FILTER_OPTIONS = {

    institutes: [
        "INSTITUTE OF TECHNOLOGY",
        "INSTITUTE OF TECHNOLOGY UNDER NIRMA UNIVERSITY"
    ],

    conferenceTypes: [
        "International",
        "National"
    ]

    // journalTypes / publicationTypes / publicationCities: add here once
    // that data/backend support exists.

};


function collapseAuthorColumns(columns, mergeAuthors) {

    if (!mergeAuthors) {
        return columns;
    }

    const firstAuthorIndex = columns.findIndex(c => c.authorPosition);

    if (firstAuthorIndex === -1) {
        return columns;
    }

    const mergedColumn = {
        key: "authors",
        label: "Authors",
        field: "authors",
        sortable: false
    };

    const insertAt = columns
        .slice(0, firstAuthorIndex)
        .filter(c => !c.authorPosition).length;

    const withoutAuthorColumns = columns.filter(c => !c.authorPosition);

    return [
        ...withoutAuthorColumns.slice(0, insertAt),
        mergedColumn,
        ...withoutAuthorColumns.slice(insertAt)
    ];

}


function getExportValue(record, column, mergeAuthors) {

    if (column.authorPosition) {

        if (!Array.isArray(record.authors)) return "";

        const author = record.authors.find(
            a => a.authorPosition === column.authorPosition
        );

        return author?.displayName ?? "";

    }

    if (column.key === "authors") {

        if (mergeAuthors) {

            if (record.authorsMerged) return record.authorsMerged;

            if (Array.isArray(record.authors)) {
                return record.authors
                    .map(a => a.displayName ?? a.name ?? "")
                    .filter(Boolean)
                    .join(", ");
            }

            return "";
        }

        if (Array.isArray(record.authors)) {
            return record.authors
                .map(a => a.displayName ?? a.name ?? "")
                .filter(Boolean)
                .join(", ");
        }

        return "";
    }

    const value = record[column.field];

    if (value === null || value === undefined) return "";

    if (Array.isArray(value)) {
        return value
            .map(item =>
                typeof item === "object"
                    ? (item.displayName ?? item.name ?? JSON.stringify(item))
                    : item
            )
            .join(", ");
    }

    if (typeof value === "object") {
        return value.displayName ?? value.name ?? JSON.stringify(value);
    }

    return value;

}


export default function PublicationPage({ publicationType }) {

    /*
    |--------------------------------------------------------------------------
    | Publication configuration
    |--------------------------------------------------------------------------
    */

    const publicationConfig = getPublicationConfig(publicationType);


    /*
    |--------------------------------------------------------------------------
    | Filter state
    |--------------------------------------------------------------------------
    */

    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});


    /*
    |--------------------------------------------------------------------------
    | Table state
    |--------------------------------------------------------------------------
    */

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(20);

    const [data, setData] = useState(null);

    const [selectedColumns, setSelectedColumns] = useState(null);

    const [sortBy, setSortBy] = useState(null);

    const [sortDir, setSortDir] = useState("DESC");


    /*
    |--------------------------------------------------------------------------
    | UI state
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [exporting, setExporting] = useState(false);

    const [mergeAuthors, setMergeAuthors] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Default filters
    |--------------------------------------------------------------------------
    */

    const createDefaultFilters = useCallback(() => {

        if (!publicationConfig) {
            return {};
        }

        const defaultFilters = {};

        publicationConfig.filters.forEach(filter => {

            if (filter.type === "author") {

                defaultFilters.authorName = "";

                defaultFilters.authorPositions = [];

            }

            else if (filter.type === "department") {

                defaultFilters.department = [];

            }

            else if (filter.type === "departmentGroup") {

                defaultFilters.departmentGroup = [];

            }

            else if (filter.id === "institute") {

                // PublicationFilter reads/writes this filter under
                // `instituteName` (matches the backend query param),
                // not the filter's own `id` ("institute").
                defaultFilters.instituteName = "";

            }

            else if (
                filter.type === "dropdown" ||
                filter.type === "text"
            ) {

                defaultFilters[filter.id] = "";

            }

            else if (filter.type === "dateRange") {

                defaultFilters.fromDate = "";

                defaultFilters.toDate = "";

            }

            else if (filter.type === "monthRange") {

                defaultFilters.fromMonth = "";

                defaultFilters.toMonth = "";

            }

            else if (filter.type === "numberRange") {

                defaultFilters[`${filter.id}From`] = "";

                defaultFilters[`${filter.id}To`] = "";

            }

            else if (filter.type === "year") {

                defaultFilters[filter.id] = "";

            }

        });

        return defaultFilters;

    }, [publicationConfig]);


    /*
    |--------------------------------------------------------------------------
    | Reset everything when publication type changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const defaultFilters = createDefaultFilters();

        setFilters(defaultFilters);

        setAppliedFilters(defaultFilters);

        setPage(0);

        setSortBy(null);

        setSortDir("DESC");

        setSelectedColumns(null);

        setData(null);

        setError("");

    }, [publicationType, createDefaultFilters]);


    /*
    |--------------------------------------------------------------------------
    | Load records
    |--------------------------------------------------------------------------
    */

    const loadData = useCallback(async () => {

        if (!publicationConfig) {
            return;
        }

        setLoading(true);

        setError("");

        try {

            const result = await searchPublication(
                publicationType,
                appliedFilters,
                {
                    page,
                    size: pageSize,
                    sortBy,
                    sortDir
                }
            );

            setData(result);

        }

        catch (err) {

            console.error(err);

            setError(
                `Could not load ${publicationConfig.title.toLowerCase()}. Is the backend running?`
            );

            setData(null);

        }

        finally {

            setLoading(false);

        }

    }, [
        publicationType,
        appliedFilters,
        page,
        pageSize,
        sortBy,
        sortDir,
        publicationConfig
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load whenever filters/page/pageSize/sorting change
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadData();

    }, [loadData]);


    /*
    |--------------------------------------------------------------------------
    | Apply filters
    |--------------------------------------------------------------------------
    */

    function handleApplyFilters() {

        setPage(0);

        setAppliedFilters(filters);

    }


    /*
    |--------------------------------------------------------------------------
    | Reset filters
    |--------------------------------------------------------------------------
    */

    function handleResetFilters() {

        const defaultFilters = createDefaultFilters();

        setFilters(defaultFilters);

        setAppliedFilters(defaultFilters);

        setPage(0);

    }


    /*
    |--------------------------------------------------------------------------
    | Page size
    |--------------------------------------------------------------------------
    */

    function handlePageSizeChange(newSize) {

        setPageSize(newSize);

        setPage(0);

    }


    /*
    |--------------------------------------------------------------------------
    | Column selection
    |--------------------------------------------------------------------------
    */

    const availableColumns =
        publicationConfig?.columns ?? [];


    const activeColumns = selectedColumns
        ? availableColumns.filter(column =>
            selectedColumns.includes(column.key)
        )
        : availableColumns;


    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    function handleSort(column) {

        if (!column.sortable) {

            return;

        }


        if (sortBy === column.field) {

            setSortDir(prev =>
                prev === "ASC"
                    ? "DESC"
                    : "ASC"
            );

        }

        else {

            setSortBy(column.field);

            setSortDir("ASC");

        }

        setPage(0);

    }


    /*
    |--------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
    | Fetches every record matching the current filters (not just the
    | current page) and writes an .xlsx using exactly the columns/labels
    | currently visible in the table.
    |--------------------------------------------------------------------------
    */

    async function handleExport() {

        setExporting(true);

        try {

            const allRecords =
                await fetchAllMatchingPublication(
                    publicationType,
                    appliedFilters,
                    {
                        sortBy,
                        sortDir
                    }
                );


            if (!allRecords || allRecords.length === 0) {

                alert(
                    `No ${publicationConfig?.singularTitle?.toLowerCase() ?? "publication"} records match the current filters.`
                );

                return;

            }

            const exportColumns = collapseAuthorColumns(activeColumns, mergeAuthors);

            const exportRows = allRecords.map(record => {

                const row = {};

                exportColumns.forEach(column => {
                    row[column.label] = getExportValue(record, column, mergeAuthors);
                });

                return row;

            });

            const worksheet = XLSX.utils.json_to_sheet(exportRows);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                publicationType || "Publication"
            );

            const date = new Date().toISOString().slice(0, 10);

            XLSX.writeFile(
                workbook,
                `${publicationType || "publication"}-data-${date}.xlsx`
            );

        }

        catch (err) {

            console.error(err);

            alert("Export failed. Please try again.");

        }

        finally {

            setExporting(false);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Invalid publication type
    |--------------------------------------------------------------------------
    */

    if (!publicationConfig) {

        return (

            <div className="p-8">

                <h1 className="text-2xl font-semibold text-red-600">

                    Invalid publication type

                </h1>

                <p className="mt-2 text-gray-500">

                    No configuration exists for "{publicationType}".

                </p>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">


                {/* Header */}

                <PublicationHeader
                    config={publicationConfig}
                />


                {/* Toolbar */}

                <PublicationToolbar

                    config={publicationConfig}

                    selectedColumns={selectedColumns}

                    onColumnsChange={
                        setSelectedColumns
                    }

                    onExport={
                        handleExport
                    }

                    exporting={
                        exporting
                    }

                />


                {/* Filters */}

                <PublicationFilter

                    config={publicationConfig}

                    filters={filters}

                    onFiltersChange={
                        setFilters
                    }

                    onApply={
                        handleApplyFilters
                    }

                    onReset={
                        handleResetFilters
                    }

                    mergeAuthors={
                        mergeAuthors
                    }

                    onMergeAuthorsChange={
                        setMergeAuthors
                    }

                    options={
                        STATIC_FILTER_OPTIONS
                    }

                />


                {/* Error */}

                {error && (

                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">

                        {error}

                    </div>

                )}


                {/* Table */}

                <PublicationTable

                    config={publicationConfig}

                    records={
                        data?.content ?? []
                    }

                    loading={
                        loading
                    }

                    totalElements={
                        data?.totalElements ?? 0
                    }

                    columns={
                        activeColumns
                    }

                    sortBy={
                        sortBy
                    }

                    sortDir={
                        sortDir
                    }

                    onSort={
                        handleSort
                    }

                    mergeAuthors={
                        mergeAuthors
                    }

                />


                {/* Pagination */}

                <PublicationPagination

                    page={
                        page
                    }

                    totalPages={
                        data?.totalPages ?? 1
                    }

                    onPageChange={
                        setPage
                    }

                    pageSize={
                        pageSize
                    }

                    pageSizeOptions={
                        PAGE_SIZE_OPTIONS
                    }

                    onPageSizeChange={
                        handlePageSizeChange
                    }

                />

            </div>

        </div>

    );

}