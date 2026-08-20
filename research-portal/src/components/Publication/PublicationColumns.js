import { useEffect, useRef, useState } from "react";
import { Columns3, Search } from "lucide-react";

/*
|--------------------------------------------------------------------------
| PublicationColumns
|--------------------------------------------------------------------------
| Previously this had its own hardcoded PUBLICATION_COLUMNS list keyed by
| publicationType, and PublicationToolbar was passing a `columns` prop that
| this component never read - so it always rendered an empty list.
|
| Fixed by making this a dumb column picker driven entirely by the
| `columns` array from publicationConfig.js (single source of truth,
| already correct for all three publication types).
|--------------------------------------------------------------------------
*/

export default function PublicationColumns({
    columns = [],
    selectedColumns,
    onColumnsChange
}) {

    const allKeys = columns.map(c => c.key);

    const popupRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [draft, setDraft] = useState(
        selectedColumns ?? allKeys
    );

    useEffect(() => {

        if (open) {
            setDraft(selectedColumns ?? allKeys);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedColumns, columns]);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    function toggleColumn(key) {

        if (draft.includes(key)) {

            setDraft(draft.filter(c => c !== key));

        } else {

            setDraft([...draft, key]);

        }

    }

    function handleApply() {

        onColumnsChange(draft);
        setOpen(false);

    }

    function handleCancel() {

        setOpen(false);

    }

    const filteredColumns = columns.filter(column =>
        column.label
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="relative" ref={popupRef}>

            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >

                <Columns3 size={18} />

                Columns

            </button>


            {open && (

                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">

                    <div className="px-5 py-4 border-b">

                        <h2 className="font-semibold">
                            Visible Columns
                        </h2>

                    </div>


                    <div className="p-4">

                        <div className="relative">

                            <Search
                                size={16}
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search Columns"
                                className="w-full border rounded-lg pl-9 pr-3 py-2"
                            />

                        </div>

                    </div>


                    <div className="max-h-72 overflow-y-auto px-5 pb-4 space-y-2">

                        {filteredColumns.map(column => (

                            <label
                                key={column.key}
                                className="flex items-center gap-3 cursor-pointer"
                            >

                                <input
                                    type="checkbox"
                                    checked={draft.includes(column.key)}
                                    onChange={() => toggleColumn(column.key)}
                                />

                                {column.label}

                            </label>

                        ))}

                        {filteredColumns.length === 0 && (

                            <p className="text-sm text-gray-400 py-3">
                                No columns found.
                            </p>

                        )}

                    </div>


                    <div className="border-t p-4 flex justify-end gap-3">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleApply}
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Apply
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}