import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import { getPublicationConfig } from "../../config/publicationConfig";
import {
    searchPublication,
    fetchAllMatchingPublication,
    fetchFilterOptions,
    fetchColumns
} from "../../api/publicationApi";
import PublicationHeader from "./PublicationHeader";
import PublicationToolbar from "./PublicationToolbar";
import PublicationFilter from "./PublicationFilter";
import PublicationTable from "./PublicationTable";
import PublicationPagination from "./PublicationPagination";

const TYPES_WITH_BACKEND_METADATA = ["conference", "journal","book-chapters"];

const AUTHOR_COUNT = 10;

function getAuthorColumns() {
    return Array.from({ length: AUTHOR_COUNT }, (_, index) => {
        const position = index + 1;

        return {
            key: `author-${position}`,
            label: `Author ${position}`,
            field: `author-${position}`,
            sortable: false,
            authorPosition: position
        };
    });
}

function buildAvailableColumns(columns, mergeAuthors) {
    const normalColumns = columns.filter(
        column => column.key !== "authors" && !column.authorPosition
    );

    if (mergeAuthors) {
        return [
            ...normalColumns,
            {
                key: "authors",
                label: "Authors",
                field: "authors",
                sortable: false,
                isAuthorColumn: true
            }
        ];
    }

    return [
        ...normalColumns,
        ...getAuthorColumns()
    ];
}

function getExportValue(record, column, mergeAuthors) {
    if (column.authorPosition != null) {
        if (!Array.isArray(record.authors)) return "";

        const author = record.authors.find(
            a => Number(a.authorPosition) === Number(column.authorPosition)
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

        return "";
    }

    const value = record[column.field];

    if (value === null || value === undefined) return "";

    if (Array.isArray(value)) {
        return value
            .map(item =>
                typeof item === "object"
                    ? (
                        item.displayName ??
                        item.name ??
                        JSON.stringify(item)
                    )
                    : item
            )
            .join(", ");
    }

    if (typeof value === "object") {
        return (
            value.displayName ??
            value.name ??
            JSON.stringify(value)
        );
    }

    return value;
}

export default function PublicationPage({ publicationType }) {
    const publicationConfig = getPublicationConfig(publicationType);

    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [data, setData] = useState(null);

    const [selectedColumns, setSelectedColumns] = useState(null);

    const [sortBy, setSortBy] = useState(null);
    const [sortDir, setSortDir] = useState("DESC");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exporting, setExporting] = useState(false);

    const [mergeAuthors, setMergeAuthors] = useState(true);

    const [filterOptions, setFilterOptions] = useState({});
    const [columns, setColumns] = useState([]);
    const [metadataError, setMetadataError] = useState("");

    const createDefaultFilters = useCallback(() => {
        if (!publicationConfig) return {};

        const defaultFilters = {};

        publicationConfig.filters.forEach(filter => {
            if (filter.type === "author") {
                defaultFilters.authorName = "";
                defaultFilters.authorPositions = [];
            } else if (filter.type === "department") {
                defaultFilters.department = [];
            } else if (filter.id === "institute") {
                defaultFilters.instituteName = "";
            } else if (
                filter.type === "dropdown" ||
                filter.type === "text"
            ) {
                defaultFilters[filter.id] = "";
            } else if (filter.type === "dateRange") {
                defaultFilters.fromDate = "";
                defaultFilters.toDate = "";
            } else if (filter.type === "monthRange") {
                defaultFilters.fromMonth = "";
                defaultFilters.fromYear = "";
                defaultFilters.toMonth = "";
                defaultFilters.toYear = "";
            } else if (filter.type === "numberRange") {
                defaultFilters[`${filter.id}From`] = "";
                defaultFilters[`${filter.id}To`] = "";
            } else if (filter.type === "year") {
                defaultFilters[filter.id] = "";
            }
        });

        return defaultFilters;
    }, [publicationConfig]);

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

    useEffect(() => {
        if (!publicationConfig) return;

        if (!TYPES_WITH_BACKEND_METADATA.includes(publicationType)) {
            setFilterOptions({});
            setColumns(publicationConfig.columns ?? []);
            setMetadataError("");
            return;
        }

        setMetadataError("");

        Promise.all([
            fetchFilterOptions(publicationType),
            fetchColumns(publicationType)
        ])
            .then(([optionsResult, columnsResult]) => {
                setFilterOptions(optionsResult);
                setColumns(columnsResult);
            })
            .catch(err => {
                console.error(err);

                setFilterOptions({});
                setColumns(publicationConfig.columns ?? []);

                setMetadataError(
                    "Could not load filter/column options from the server. Showing defaults."
                );
            });
    }, [publicationType, publicationConfig]);

    const loadData = useCallback(async () => {
        if (!publicationConfig) return;

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
        } catch (err) {
            console.error(err);

            setError(
                `Could not load ${publicationConfig.title.toLowerCase()}. Is the backend running?`
            );

            setData(null);
        } finally {
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleApplyFilters() {
        setPage(0);
        setAppliedFilters(filters);
    }

    function handleResetFilters() {
        const defaultFilters = createDefaultFilters();

        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);

        setPage(0);
    }

    function handlePageSizeChange(newSize) {
        setPageSize(newSize);
        setPage(0);
    }

    /*
     * This is now the SINGLE source of truth for the columns.
     *
     * Merge ON:
     *   normal columns + Authors
     *
     * Merge OFF:
     *   normal columns + Author 1 ... Author 10
     */
    const availableColumns = useMemo(
        () => buildAvailableColumns(columns, mergeAuthors),
        [columns, mergeAuthors]
    );

    /*
     * Keep selectedColumns synchronized with the currently
     * available column keys.
     *
     * When selectedColumns is null, everything is visible.
     */
    const activeColumns = useMemo(() => {
        if (selectedColumns === null) {
            return availableColumns;
        }

        return availableColumns.filter(column =>
            selectedColumns.includes(column.key)
        );
    }, [availableColumns, selectedColumns]);

    /*
     * When switching between merged/unmerged mode, replace
     * the author selection while preserving all normal columns.
     */
    function handleMergeAuthorsChange(nextMergeAuthors) {
        setMergeAuthors(nextMergeAuthors);

        setSelectedColumns(prevSelected => {
            /*
             * null means "everything selected".
             * Keep it that way because all currently available
             * columns should remain visible.
             */
            if (prevSelected === null) {
                return null;
            }

            const normalKeys = columns
                .filter(
                    column =>
                        column.key !== "authors" &&
                        !column.authorPosition
                )
                .map(column => column.key);

            const previousNormalSelections = prevSelected.filter(key =>
                normalKeys.includes(key)
            );

            if (nextMergeAuthors) {
                /*
                 * Switching to merged mode:
                 * preserve normal selections and show Authors.
                 */
                return [
                    ...previousNormalSelections,
                    "authors"
                ];
            }

            /*
             * Switching to unmerged mode:
             * preserve normal selections and select all
             * Author 1-10 by default.
             */
            const authorKeys = getAuthorColumns().map(
                column => column.key
            );

            return [
                ...previousNormalSelections,
                ...authorKeys
            ];
        });
    }

    function handleSort(column) {
        if (!column.sortable) return;

        if (sortBy === column.field) {
            setSortDir(prev =>
                prev === "ASC" ? "DESC" : "ASC"
            );
        } else {
            setSortBy(column.field);
            setSortDir("ASC");
        }

        setPage(0);
    }

    async function handleExport() {
        setExporting(true);

        try {
            const allRecords = await fetchAllMatchingPublication(
                publicationType,
                appliedFilters,
                {
                    sortBy,
                    sortDir
                }
            );

            if (!allRecords || allRecords.length === 0) {
                alert(
                    `No ${
                        publicationConfig?.singularTitle?.toLowerCase() ??
                        "publication"
                    } records match the current filters.`
                );

                return;
            }

            const exportRows = allRecords.map(record => {
                const row = {};

                activeColumns.forEach(column => {
                    row[column.label] = getExportValue(
                        record,
                        column,
                        mergeAuthors
                    );
                });

                return row;
            });

            const worksheet =
                XLSX.utils.json_to_sheet(exportRows);

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                publicationType || "Publication"
            );

            const date = new Date()
                .toISOString()
                .slice(0, 10);

            XLSX.writeFile(
                workbook,
                `${publicationType || "publication"}-data-${date}.xlsx`
            );
        } catch (err) {
            console.error(err);
            alert("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    }

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <PublicationHeader
                    config={publicationConfig}
                />

                <PublicationToolbar
                    config={{
                        ...publicationConfig,
                        columns: availableColumns
                    }}
                    selectedColumns={selectedColumns}
                    onColumnsChange={setSelectedColumns}
                    onExport={handleExport}
                    exporting={exporting}
                />

                <PublicationFilter
                    config={publicationConfig}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                    mergeAuthors={mergeAuthors}
                    onMergeAuthorsChange={handleMergeAuthorsChange}
                    options={filterOptions}
                />

                {metadataError && (
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
                        {metadataError}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <PublicationPagination
                        page={page}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={setPage}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>

                <PublicationTable
                    config={publicationConfig}
                    records={data?.content ?? []}
                    loading={loading}
                    totalElements={data?.totalElements ?? 0}
                    columns={activeColumns}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onSort={handleSort}
                    mergeAuthors={mergeAuthors}
                />

            </div>
        </div>
    );
}