import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export default function PublicationSorting({
    columns,
    sortColumn,
    sortDirection,
    onSortChange
}) {

    function handleColumnChange(e) {

        const column = e.target.value;

        onSortChange({
            column,
            direction: "asc"
        });

    }

    function toggleDirection() {

        onSortChange({
            column: sortColumn,
            direction:
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
        });

    }

    return (

        <div className="flex items-center gap-2">

            <select
                value={sortColumn || ""}
                onChange={handleColumnChange}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            >

                <option value="">
                    Sort by
                </option>

                {columns.map(column => (

                    <option
                        key={column}
                        value={column}
                    >
                        {column}
                    </option>

                ))}

            </select>

            <button
                onClick={toggleDirection}
                disabled={!sortColumn}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                    sortDirection === "asc"
                        ? "Ascending"
                        : "Descending"
                }
            >

                {sortDirection === "asc"
                    ? <ArrowDownAZ size={18} />
                    : <ArrowUpAZ size={18} />
                }

            </button>

        </div>

    );

}