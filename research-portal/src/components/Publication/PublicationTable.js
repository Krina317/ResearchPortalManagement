import {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Loader2
} from "lucide-react";


export default function PublicationTable({
    config,
    records,
    loading,
    totalElements,
    columns,
    sortBy,
    sortDir,
    onSort,
    mergeAuthors
}) {


    /*
    |--------------------------------------------------------------------------
    | Column picker now lists Author1..Author10 individually (so they can be
    | shown/hidden one at a time). When "Merge" is on, collapse whichever of
    | those are currently visible down into a single merged "Authors" column
    | instead. When "Unmerge" is on, leave them as separate columns.
    |--------------------------------------------------------------------------
    */

    function getDisplayColumns() {

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

        // Insertion point within the author-column-free list: count how
        // many non-author columns come before the first author column in
        // the original order.
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

    const displayColumns = getDisplayColumns();


    function getCellValue(record, column) {


        /*
        |--------------------------------------------------------------------------
        | Individual Author1..Author10 column (unmerged view)
        |--------------------------------------------------------------------------
        */

        if (column.authorPosition) {

            if (!Array.isArray(record.authors)) {
                return "—";
            }

            const author = record.authors.find(
                a => a.authorPosition === column.authorPosition
            );

            return author?.displayName ?? "—";

        }


        /*
        |--------------------------------------------------------------------------
        | Merged authors column ("Author1, Author2, ...")
        |--------------------------------------------------------------------------
        */

        if (column.key === "authors") {

            if (record.authorsMerged) {
                return record.authorsMerged;
            }

            if (Array.isArray(record.authors)) {

                return record.authors
                    .map(author =>
                        author.displayName ?? author.name ?? ""
                    )
                    .filter(Boolean)
                    .join(", ");

            }

            return "—";
        }


        /*
        |--------------------------------------------------------------------------
        | Normal values
        |--------------------------------------------------------------------------
        */

        const value = record[column.field];

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        /*
        |--------------------------------------------------------------------------
        | Arrays / objects
        |--------------------------------------------------------------------------
        */

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


        return String(value);

    }


    function getSortIcon(column) {

        if (!column.sortable) {
            return null;
        }


        if (sortBy !== column.field) {

            return (
                <ArrowUpDown
                    size={14}
                    className="text-gray-400"
                />
            );

        }


        if (sortDir === "ASC") {

            return (
                <ArrowUp
                    size={14}
                    className="text-emerald-600"
                />
            );

        }


        return (
            <ArrowDown
                size={14}
                className="text-emerald-600"
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="bg-white rounded-xl border border-gray-200">

                <div className="flex flex-col items-center justify-center py-16">

                    <Loader2
                        size={30}
                        className="animate-spin text-emerald-600"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading {config.title.toLowerCase()}...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Table
    |--------------------------------------------------------------------------
    */

    return (

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Table header information */}

            <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                <div>

                    <h2 className="font-semibold text-gray-800">

                        {config.title}

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        {totalElements} record
                        {totalElements === 1 ? "" : "s"}

                    </p>

                </div>

            </div>


            {/* Responsive table wrapper */}

            <div className="w-full overflow-x-auto">

                <table className="w-full min-w-max border-collapse">

                    <thead className="bg-gray-50">

                        <tr>

                            {displayColumns.map(column => (

                                <th
                                    key={column.key}
                                    className="
                                        px-4 py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-600
                                        uppercase
                                        tracking-wide
                                        border-b
                                        whitespace-nowrap
                                    "
                                >

                                    {column.sortable ? (

                                        <button
                                            onClick={() =>
                                                onSort(column)
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                hover:text-emerald-600
                                                transition
                                            "
                                        >

                                            <span>
                                                {column.label}
                                            </span>

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
                                    colSpan={displayColumns.length}
                                    className="
                                        px-6
                                        py-12
                                        text-center
                                        text-gray-500
                                    "
                                >

                                    No records found.

                                </td>

                            </tr>

                        ) : (

                            records.map((record, rowIndex) => (

                                <tr
                                    key={
                                        record.id ??
                                        rowIndex
                                    }
                                    className="
                                        border-b
                                        last:border-b-0
                                        hover:bg-gray-50
                                        transition
                                    "
                                >

                                    {displayColumns.map(column => (

                                        <td
                                            key={column.key}
                                            className="
                                                px-4
                                                py-3
                                                text-sm
                                                text-gray-700
                                                align-top
                                            "
                                        >

                                            <div
                                                className="
                                                    max-w-[320px]
                                                    whitespace-normal
                                                    break-words
                                                "
                                                title={
                                                    getCellValue(
                                                        record,
                                                        column
                                                    )
                                                }
                                            >

                                                {getCellValue(
                                                    record,
                                                    column
                                                )}

                                            </div>

                                        </td>

                                    ))}

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}