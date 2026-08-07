import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Pencil } from "lucide-react";

const MAX_AUTHOR_COLUMNS = 10;

const BASE_COLUMNS = [
    { key: "id", label: "ID" },
    { key: "conferenceName", label: "Conference" },
    { key: "paperTitle", label: "Paper Title" },
    { key: "conferenceType", label: "Type" },
    { key: "deptCode", label: "Department" },
    { key: "instituteName", label: "Institute" },
    { key: "fromDate", label: "From Date" },
    { key: "toDate", label: "To Date" }
];

export default function ConferenceTable({ records, loading, totalElements, selectedColumns, mergeAuthors }) {

    const [expandedCell, setExpandedCell] = useState(null);
    // { text, header }

    const popupRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event){
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setExpandedCell(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    function handleCellClick(text, header){
        if (!text) return;
        setExpandedCell({ text, header });
    }

    const maxAuthorsInData = records.reduce(
        (max, record) => Math.max(max, record.authors?.length ?? 0),
        0
    );
    const authorColumnCount = Math.min(maxAuthorsInData, MAX_AUTHOR_COLUMNS);

    const authorColumns = mergeAuthors
        ? [{ key: "authorsMerged", label: "Authors" }]
        : Array.from({ length: authorColumnCount }, (_, i) => ({
              key: `author${i + 1}`,
              label: `Author ${i + 1}`
          }));

    let columns = [...BASE_COLUMNS, ...authorColumns, { key: "actions", label: "Actions" }];

    if (selectedColumns) {
        columns = columns.filter(col => col.key === "actions" || selectedColumns.includes(col.label));
    }

    return (

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 min-w-0 max-w-full">

            <div className="px-5 py-4 border-b">
                <h2 className="font-semibold">
                    {loading ? "Loading..." : `Showing ${totalElements} Records`}
                </h2>
            </div>

            <div className="overflow-x-auto min-w-0 max-w-full">

                <table style={{ minWidth: "1400px", width: "100%" }} className="border-collapse">

                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className="px-3 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.key !== "actions" &&
                                            <ArrowUpDown size={14}/>
                                        }
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>

                        {!loading && records.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}

                        {records.map(record => {

                            const cellsByKey = {
                                id: (
                                    <td key="id" className="px-3 py-3 text-sm">
                                        {record.id}
                                    </td>
                                ),
                                conferenceName: (
                                    <td
                                        key="conferenceName"
                                        onClick={() => handleCellClick(record.conferenceName, "Conference")}
                                        className="px-3 py-3 text-sm max-w-[200px] truncate cursor-pointer"
                                    >
                                        {record.conferenceName || "—"}
                                    </td>
                                ),
                                paperTitle: (
                                    <td
                                        key="paperTitle"
                                        onClick={() => handleCellClick(record.paperTitle, "Paper Title")}
                                        className="px-3 py-3 text-sm max-w-[240px] truncate cursor-pointer"
                                    >
                                        {record.paperTitle || "—"}
                                    </td>
                                ),
                                conferenceType: (
                                    <td key="conferenceType" className="px-3 py-3 text-sm whitespace-nowrap">
                                        {record.conferenceType}
                                    </td>
                                ),
                                deptCode: (
                                    <td key="deptCode" className="px-3 py-3 text-sm">
                                        {record.deptCode}
                                    </td>
                                ),
                                instituteName: (
                                    <td
                                        key="instituteName"
                                        onClick={() => handleCellClick(record.instituteName, "Institute")}
                                        className="px-3 py-3 text-sm max-w-[160px] truncate cursor-pointer"
                                    >
                                        {record.instituteName || "—"}
                                    </td>
                                ),
                                fromDate: (
                                    <td key="fromDate" className="px-3 py-3 text-sm whitespace-nowrap">
                                        {record.fromDate}
                                    </td>
                                ),
                                toDate: (
                                    <td key="toDate" className="px-3 py-3 text-sm whitespace-nowrap">
                                        {record.toDate}
                                    </td>
                                ),
                                authorsMerged: (
                                    <td
                                        key="authorsMerged"
                                        onClick={() => handleCellClick(record.authorsMerged, "Authors")}
                                        className="px-3 py-3 text-sm max-w-[260px] truncate cursor-pointer"
                                    >
                                        {record.authorsMerged || "—"}
                                    </td>
                                ),
                                actions: (
                                    <td key="actions" className="px-3 py-3">
                                        <button>
                                            <Pencil size={17} className="text-emerald-600"/>
                                        </button>
                                    </td>
                                )
                            };

                            if (!mergeAuthors) {
                                authorColumns.forEach((col, i) => {
                                    const author = record.authors?.[i];
                                    const name = author?.displayName ?? "";
                                    cellsByKey[col.key] = (
                                        <td
                                            key={col.key}
                                            onClick={() => handleCellClick(name, col.label)}
                                            className="px-3 py-3 text-sm max-w-[160px] truncate cursor-pointer"
                                        >
                                            {name || "—"}
                                        </td>
                                    );
                                });
                            }

                            return (
                                <tr key={record.id} className="border-t hover:bg-gray-50">
                                    {columns.map(col => cellsByKey[col.key])}
                                </tr>
                            );

                        })}

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
                            <h3 className="font-semibold text-sm text-gray-500">{expandedCell.header}</h3>
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