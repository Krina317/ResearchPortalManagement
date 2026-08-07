import { useEffect, useRef, useState } from "react";
import { Columns3, Search } from "lucide-react";

const ALL_COLUMNS = [
    "ID",
    "Conference",
    "Paper Title",
    "Type",
    "Department",
    "Institute",
    "From Date",
    "To Date",
    "Author 1",
    "Author 2",
    "Author 3",
    "Author 4",
    "Author 5",
    "Author 6",
    "Author 7",
    "Author 8",
    "Author 9",
    "Author 10",
    "Actions"
];

export default function ColumnSelector({ selectedColumns, onColumnsChange }) {

    const popupRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Local draft state so Cancel doesn't apply partial changes.
    const [draft, setDraft] = useState(selectedColumns ?? ALL_COLUMNS);

    useEffect(() => {
        if (open) {
            setDraft(selectedColumns ?? ALL_COLUMNS);
        }
    }, [open, selectedColumns]);

    useEffect(() => {
        function handleClickOutside(event){
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggleColumn(column){
        if (draft.includes(column)) {
            setDraft(draft.filter(c => c !== column));
        } else {
            setDraft([...draft, column]);
        }
    }

    function handleApply(){
        onColumnsChange(draft);
        setOpen(false);
    }

    function handleCancel(){
        setOpen(false);
    }

    const filteredColumns = ALL_COLUMNS.filter(column =>
        column.toLowerCase().includes(search.toLowerCase())
    );

    return(
        <div className="relative" ref={popupRef}>

            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
                <Columns3 size={18}/>
                Columns
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border z-50">

                    <div className="px-5 py-4 border-b">
                        <h2 className="font-semibold">Visible Columns</h2>
                    </div>

                    <div className="p-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
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
                            <label key={column} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.includes(column)}
                                    onChange={() => toggleColumn(column)}
                                />
                                {column}
                            </label>
                        ))}
                    </div>

                    <div className="border-t p-4 flex justify-end gap-3">
                        <button onClick={handleCancel} className="px-4 py-2 border rounded-lg">
                            Cancel
                        </button>
                        <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
                            Apply
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}