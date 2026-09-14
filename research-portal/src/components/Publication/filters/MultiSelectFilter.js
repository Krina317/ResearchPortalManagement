import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function MultiSelectFilter({
    label,
    value = [],
    options = [],
    onChange
}) {
    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);

    const selectedValues = Array.isArray(value) ? value : [];

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
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function toggleOption(option) {
        if (selectedValues.includes(option)) {
            onChange(
                selectedValues.filter(item => item !== option)
            );
        } else {
            onChange([
                ...selectedValues,
                option
            ]);
        }
    }

    function selectAll() {
        onChange([...options]);
    }

    function clearAll() {
        onChange([]);
    }

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
                {label}
            </label>

            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
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
                    {selectedValues.length === 0
                        ? "All"
                        : `${selectedValues.length} Selected`
                    }
                </span>

                <ChevronDown
                    size={18}
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
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
                    {/* HEADER */}
                    <div className="
                        px-5
                        py-4
                        border-b
                    ">
                        <h2 className="font-semibold text-gray-800">
                            Select {label}
                        </h2>
                    </div>

                    {/* SELECT / CLEAR */}
                    <div className="
                        flex
                        justify-between
                        px-5
                        py-3
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

                    {/* INDEXING SERVICES */}
                    <div className="
                        max-h-60
                        overflow-y-auto
                        px-5
                        pb-4
                    ">
                        {options.map(option => (
                            <label
                                key={option}
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
                                    checked={selectedValues.includes(option)}
                                    onChange={() =>
                                        toggleOption(option)
                                    }
                                />

                                <span>
                                    {option}
                                </span>
                            </label>
                        ))}

                        {options.length === 0 && (
                            <p className="
                                text-sm
                                text-gray-400
                                py-3
                            ">
                                No options available.
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