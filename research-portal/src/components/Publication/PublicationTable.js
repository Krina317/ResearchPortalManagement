import { useState } from "react";
import {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Loader2
} from "lucide-react";

const STUDENT_TYPES = ["UG", "PG", "PHD"];

// Choices shown in the dropdown. Add "EXTERNAL" here once the backend accepts it.
const TYPE_OPTIONS = ["UG", "PG", "PHD"];

const TYPE_LABEL = { UG: "UG", PG: "PG", PHD: "PhD", EXTERNAL: "External" };

function sortedAuthors(record) {
    if (!Array.isArray(record.authors)) return [];
    return [...record.authors].sort(
        (a, b) => Number(a.authorPosition) - Number(b.authorPosition)
    );
}

function isStudent(author) {
    return STUDENT_TYPES.includes(author?.studentType);
}

/* No type yet, not NU, not waiting for review -> ask what this author is. */
function needsType(author) {
    const underReview = author.needsReview ?? author.author?.needsReview;
    return !author.studentType && !author.authorType && !underReview;
}

function AuthorCell({ author, editable, saving, onChange }) {
    return (
        <span
            className={`inline-flex flex-wrap items-center gap-1.5 rounded px-1.5 py-0.5 ${
                isStudent(author) ? "bg-amber-100" : ""
            }`}
        >
            <span>{author.displayName}</span>

            {isStudent(author) && (
                <span className="text-[10px] font-semibold text-amber-800">
                    {TYPE_LABEL[author.studentType]}
                </span>
            )}

            {editable && needsType(author) && (
                <select
                    value=""
                    disabled={saving}
                    onChange={e => onChange(author, e.target.value)}
                    className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white text-gray-600 disabled:opacity-50"
                >
                    <option value="">Set type…</option>
                    {TYPE_OPTIONS.map(type => (
                        <option key={type} value={type}>
                            {TYPE_LABEL[type]}
                        </option>
                    ))}
                </select>
            )}
        </span>
    );
}

export default function PublicationTable({
    config,
    records,
    loading,
    totalElements,
    columns,
    sortBy,
    sortDir,
    onSort,
    mergeAuthors,
    onStudentTypeChange,
    selectionMode,
    selectedIds = [],
    onToggleSelect,
    onToggleAll
}) {
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");

    const editable = config.key === "journal" && Boolean(onStudentTypeChange);

    const selecting = Boolean(selectionMode);
    const allOnPageSelected =
        records.length > 0 && records.every(r => selectedIds.includes(r.id));

    async function handleTypeChange(record, author, value) {
        if (!value) return;

        setSavingId(author.id);
        setError("");

        try {
            await onStudentTypeChange(record, author, value);
        } catch (err) {
            console.error(err);
            setError(`Could not save the type for ${author.displayName}.`);
        } finally {
            setSavingId(null);
        }
    }

    /* Plain-text value (also used for the hover title). */
    function getCellValue(record, column) {

        if (column.authorPosition != null) {
            const author = sortedAuthors(record).find(
                a => Number(a.authorPosition) === Number(column.authorPosition)
            );
            return author?.displayName ?? "—";
        }

        if (column.key === "authors") {
            if (record.mergedAuthors) return record.mergedAuthors;
            if (record.authorsMerged) return record.authorsMerged;

            const names = sortedAuthors(record)
                .map(a => a?.displayName ?? a?.name ?? "")
                .filter(Boolean);

            return names.length ? names.join(", ") : "—";
        }

        if (column.yesNo) {
            return record[column.field] ? "Yes" : "No";
        }

        const value = record[column.field];

        if (value === null || value === undefined || value === "") {
            return "—";
        }

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

        return String(value);
    }

    /* Author columns render per author (highlight + dropdown); the rest are text. */
    function renderCell(record, column) {
        const authorProps = author => ({
            author,
            editable,
            saving: savingId === author.id,
            onChange: (a, value) => handleTypeChange(record, a, value)
        });

        if (column.authorPosition != null) {
            const author = sortedAuthors(record).find(
                a => Number(a.authorPosition) === Number(column.authorPosition)
            );
            return author ? <AuthorCell {...authorProps(author)} /> : "—";
        }

        if (column.key === "authors") {
            const authors = sortedAuthors(record);
            if (authors.length === 0) return getCellValue(record, column);

            return (
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {authors.map(author => (
                        <AuthorCell
                            key={author.id ?? author.authorPosition}
                            {...authorProps(author)}
                        />
                    ))}
                </div>
            );
        }

        return getCellValue(record, column);
    }

    /* Unmerged author columns: tint the whole cell for students. */
    function cellTint(record, column) {
        if (column.authorPosition == null) return "";

        const author = sortedAuthors(record).find(
            a => Number(a.authorPosition) === Number(column.authorPosition)
        );

        return isStudent(author) ? "bg-amber-100" : "";
    }

    function getSortIcon(column) {
        if (!column.sortable) {
            return null;
        }

        if (sortBy !== column.field) {
            return <ArrowUpDown size={14} className="text-gray-400" />;
        }

        if (sortDir === "ASC") {
            return <ArrowUp size={14} className="text-emerald-600" />;
        }

        return <ArrowDown size={14} className="text-emerald-600" />;
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={30} className="animate-spin text-emerald-600" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading {config.title.toLowerCase()}...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="font-semibold text-gray-800">
                        {config.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalElements} record{totalElements === 1 ? "" : "s"}
                    </p>
                </div>

                {editable && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                        Student author (UG / PG / PhD)
                    </p>
                )}
            </div>

            {error && (
                <p className="px-5 py-2 text-sm text-red-600 border-b">{error}</p>
            )}

            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max border-collapse">

                    <thead className="bg-gray-50">
                        <tr>
                            {selecting && (
                                <th className="px-4 py-3 border-b w-10">
                                    {selectionMode === "delete" && (
                                        <input
                                            type="checkbox"
                                            checked={allOnPageSelected}
                                            onChange={() => onToggleAll?.(records)}
                                            className="accent-emerald-600"
                                            aria-label="Select all on this page"
                                        />
                                    )}
                                </th>
                            )}

                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-b whitespace-nowrap"
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => onSort(column)}
                                            className="flex items-center gap-2 hover:text-emerald-600 transition"
                                        >
                                            <span>{column.label}</span>
                                            {getSortIcon(column)}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selecting ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            records.map((record, rowIndex) => {
                                const selected = selectedIds.includes(record.id);

                                return (
                                    <tr
                                        key={record.id ?? rowIndex}
                                        className={`border-b last:border-b-0 transition ${
                                            selected
                                                ? "bg-emerald-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        {selecting && (
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => onToggleSelect?.(record.id)}
                                                    className="accent-emerald-600"
                                                    aria-label={`Select record ${record.id}`}
                                                />
                                            </td>
                                        )}

                                        {columns.map(column => (
                                            <td
                                                key={column.key}
                                                className={`px-4 py-3 text-sm text-gray-700 align-top ${cellTint(record, column)}`}
                                            >
                                                <div
                                                    className="max-w-[320px] whitespace-normal break-words"
                                                    title={getCellValue(record, column)}
                                                >
                                                    {renderCell(record, column)}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                </table>
            </div>

        </div>
    );
}