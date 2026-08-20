import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AuthorFilter({
    authorName = "",
    selectedPositions = [],
    onAuthorNameChange,
    onPositionsChange,
    mergeAuthors,
    onMergeAuthorsChange
}) {

    const positions = [
        "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "10"
    ];

    const [open, setOpen] = useState(false);

    const popupRef = useRef(null);


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


    function togglePosition(position) {

        if (selectedPositions.includes(position)) {

            onPositionsChange(
                selectedPositions.filter(
                    item => item !== position
                )
            );

        } else {

            onPositionsChange([
                ...selectedPositions,
                position
            ]);

        }

    }


    function selectAll() {
        onPositionsChange(positions);
    }


    function clearAll() {
        onPositionsChange([]);
    }


    return (

        <div className="
            bg-white
            border border-gray-200
            rounded-xl
            p-6
        ">

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-5
            ">

                {/* AUTHOR NAME */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        Author Name
                    </label>

                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) =>
                            onAuthorNameChange(
                                e.target.value
                            )
                        }
                        placeholder="Search Author"
                        className="
                            w-full
                            border border-gray-300
                            rounded-lg
                            px-3 py-2
                            text-sm
                            focus:ring-2
                            focus:ring-emerald-500
                            outline-none
                        "
                    />

                </div>


                {/* AUTHOR POSITION */}

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
                        Author Position
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
                        "
                    >

                        {selectedPositions.length === 0
                            ? "Any Position"
                            : `${selectedPositions.length} Selected`
                        }

                        <ChevronDown size={18} />

                    </button>


                    {open && (

                        <div className="
                            absolute
                            left-0
                            mt-2
                            w-72
                            bg-white
                            rounded-xl
                            border border-gray-200
                            shadow-xl
                            z-50
                        ">

                            <div className="
                                px-5
                                py-4
                                border-b
                            ">

                                <h2 className="font-semibold">
                                    Author Position
                                </h2>

                            </div>


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
                                    className="text-emerald-600"
                                >
                                    Select All
                                </button>

                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-red-500"
                                >
                                    Clear
                                </button>

                            </div>


                            <div className="
                                grid
                                grid-cols-2
                                gap-2
                                px-5
                                pb-4
                            ">

                                {positions.map(
                                    position => (

                                        <label
                                            key={position}
                                            className="
                                                flex
                                                gap-2
                                                items-center
                                                text-sm
                                            "
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedPositions.includes(
                                                        position
                                                    )
                                                }
                                                onChange={() =>
                                                    togglePosition(
                                                        position
                                                    )
                                                }
                                            />

                                            {position}

                                        </label>

                                    )
                                )}

                            </div>


                            <div className="
                                border-t
                                p-4
                                flex
                                justify-end
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="
                                        px-4
                                        py-2
                                        rounded-lg
                                        bg-emerald-600
                                        text-white
                                        text-sm
                                    "
                                >
                                    Apply
                                </button>

                            </div>

                        </div>

                    )}

                </div>


                {/* MERGE / UNMERGE */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        View Authors
                    </label>

                    <div className="
                        flex
                        rounded-lg
                        overflow-hidden
                        border border-gray-300
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                onMergeAuthorsChange(true)
                            }
                            className={`
                                flex-1
                                py-2
                                text-sm
                                ${
                                    mergeAuthors
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white"
                                }
                            `}
                        >
                            Merge
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onMergeAuthorsChange(false)
                            }
                            className={`
                                flex-1
                                py-2
                                text-sm
                                ${
                                    !mergeAuthors
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white"
                                }
                            `}
                        >
                            Unmerge
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}