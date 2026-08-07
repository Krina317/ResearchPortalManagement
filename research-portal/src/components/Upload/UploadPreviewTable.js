import { useState, useEffect, useRef } from "react";

const ROWS_PER_PAGE = 15;

export default function UploadPreviewTable({ headers, rows }){

    const [page, setPage] = useState(1);

    const [expandedCell, setExpandedCell] = useState(null);
    // { text, header }

    const popupRef = useRef(null);

    useEffect(() => {
        setPage(1);
    }, [rows]);

    useEffect(() => {

        function handleClickOutside(event){

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ){
                setExpandedCell(null);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

    const startIndex = (page - 1) * ROWS_PER_PAGE;

    const pageRows = rows.slice(startIndex, startIndex + ROWS_PER_PAGE);

    function goToPage(p){
        if (p < 1 || p > totalPages) return;
        setPage(p);
    }

    function handleCellClick(text, header){
        if (!text) return;
        setExpandedCell({ text, header });
    }

    return(

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 max-w-full relative">

            <div className="px-5 py-4 border-b flex flex-wrap justify-between items-center gap-3">

                <div>

                    <h2 className="font-semibold">

                        Upload Preview

                    </h2>

                    <p className="text-sm text-gray-500">

                        Showing {startIndex + 1}–{startIndex + pageRows.length} of {rows.length} rows · Click a cell to view full text

                    </p>

                </div>

                {totalPages > 1 && (

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            Previous

                        </button>

                        <p className="text-sm text-gray-500 whitespace-nowrap">

                            Page {page} of {totalPages}

                        </p>

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            Next

                        </button>

                    </div>

                )}

            </div>

            <div className="w-full overflow-x-auto">

                <table className="border-collapse" style={{ minWidth: "1400px", width: "100%" }}>

                    <thead className="bg-gray-50">

                        <tr>

                            {headers.map((col, i) =>

                                <th
                                    key={i}
                                    className="px-3 py-2 text-left text-xs font-semibold text-gray-600 truncate border-b"
                                    style={{ maxWidth: "180px" }}
                                    title={col}
                                >

                                    {col}

                                </th>

                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {pageRows.map((row, i) =>

                            <tr
                                key={startIndex + i}
                                className="border-t hover:bg-gray-50"
                            >

                                {row.map((cell, j) =>

                                    <td
                                        key={j}
                                        onClick={() => handleCellClick(cell, headers[j])}
                                        className="px-3 py-2 text-sm truncate cursor-pointer"
                                        style={{ maxWidth: "180px" }}
                                    >

                                        {cell || "—"}

                                    </td>

                                )}

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {expandedCell && (

                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6">

                    <div
                        ref={popupRef}
                        className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full max-h-[70vh] overflow-y-auto"
                    >

                        <div className="px-5 py-4 border-b flex justify-between items-center">

                            <h3 className="font-semibold text-sm text-gray-500">

                                {expandedCell.header}

                            </h3>

                            <button
                                onClick={() => setExpandedCell(null)}
                                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                            >

                                ×

                            </button>

                        </div>

                        <div className="px-5 py-4 text-sm whitespace-pre-wrap">

                            {expandedCell.text}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}