import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function DepartmentFilter({
    selectedDepartments = [],
    departments = [],
    onChange
}) {

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const popupRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Normalize departments to {value, label} objects.
    |--------------------------------------------------------------------------
    | Accepts either plain strings (conference, where the code IS the
    | display name - e.g. "CSE") or {value, label} objects (journal,
    | where the value is a short code like "CSE" but the label should
    | show the full department name).
    |--------------------------------------------------------------------------
    */
    const normalizedDepartments = departments.map(d =>
        typeof d === "string" ? { value: d, label: d } : d
    );


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    function toggleDepartment(value) {

        if (selectedDepartments.includes(value)) {

            onChange(
                selectedDepartments.filter(
                    item => item !== value
                )
            );

        } else {

            onChange([
                ...selectedDepartments,
                value
            ]);

        }

    }


    function selectAll() {
        onChange(normalizedDepartments.map(d => d.value));
    }


    function clearAll() {
        onChange([]);
    }


    const filteredDepartments = normalizedDepartments.filter(
        d =>
            d.label
                .toLowerCase()
                .includes(search.toLowerCase())
    );


    return (

        <div
            className="relative"
            ref={popupRef}
        >

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">
                Department
            </label>


            <button
                type="button"
                onClick={() =>
                    setOpen(prev => !prev)
                }
                className="
                    w-full
                    border border-gray-300
                    rounded-lg
                    px-3 py-2
                    flex
                    justify-between
                    items-center
                    bg-white
                    text-sm
                    hover:border-emerald-500
                "
            >

                <span>

                    {selectedDepartments.length === 0
                        ? "All Departments"
                        : `${selectedDepartments.length} Selected`
                    }

                </span>

                <ChevronDown size={18} />

            </button>


            {open && (

                <div className="
                    absolute
                    left-0
                    mt-2
                    w-full
                    min-w-[280px]
                    bg-white
                    border border-gray-200
                    rounded-xl
                    shadow-xl
                    z-50
                ">

                    <div className="
                        px-5
                        py-4
                        border-b
                    ">

                        <h2 className="font-semibold text-gray-800">
                            Select Departments
                        </h2>

                    </div>


                    {/* SEARCH */}

                    <div className="p-4">

                        <div className="relative">

                            <Search
                                size={16}
                                className="
                                    absolute
                                    left-3
                                    top-3
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search Department"
                                className="
                                    w-full
                                    border border-gray-300
                                    rounded-lg
                                    pl-9
                                    pr-3
                                    py-2
                                    text-sm
                                    outline-none
                                "
                            />

                        </div>

                    </div>


                    {/* SELECT / CLEAR */}

                    <div className="
                        flex
                        justify-between
                        px-5
                        pb-3
                        text-sm
                    ">

                        <button
                            type="button"
                            onClick={selectAll}
                            className="
                                text-emerald-600
                                hover:underline
                            "
                        >
                            Select All
                        </button>

                        <button
                            type="button"
                            onClick={clearAll}
                            className="
                                text-red-500
                                hover:underline
                            "
                        >
                            Clear
                        </button>

                    </div>


                    {/* DEPARTMENTS */}

                    <div className="
                        max-h-60
                        overflow-y-auto
                        px-5
                        pb-4
                    ">

                        {filteredDepartments.map(
                            d => (

                                <label
                                    key={d.value}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        py-2
                                        cursor-pointer
                                        text-sm
                                    "
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedDepartments.includes(
                                                d.value
                                            )
                                        }
                                        onChange={() =>
                                            toggleDepartment(
                                                d.value
                                            )
                                        }
                                    />

                                    <span>
                                        {d.label}
                                    </span>

                                </label>

                            )
                        )}

                        {filteredDepartments.length === 0 && (

                            <p className="
                                text-sm
                                text-gray-400
                                py-3
                            ">
                                No departments found.
                            </p>

                        )}

                    </div>


                    {/* APPLY */}

                    <div className="
                        border-t
                        p-4
                        flex
                        justify-end
                    ">

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-emerald-600
                                text-white
                                text-sm
                                hover:bg-emerald-700
                            "
                        >
                            Apply
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}