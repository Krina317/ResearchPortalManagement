import * as XLSX from "xlsx";
import { Download } from "lucide-react";

/*
|--------------------------------------------------------------------------
| PublicationExport
|--------------------------------------------------------------------------
| Previously this took `selectedColumns` as an array of display LABELS
| ("Conference Name", "Institute Name", ...) and tried to reverse-engineer
| the record property name from the label text. That broke as soon as a
| label didn't match the excel/DTO field name 1:1 (e.g. conference's real
| fields are "conferenceName"/"instituteName" while the excel header says
| "Name of Conference"/"InstName").
|
| Now it takes the actual `columns` config (key/field/label), which is the
| same source of truth PublicationTable uses to render cells - so whatever
| you see on screen is exactly what gets exported.
|--------------------------------------------------------------------------
*/

function getExportValue(record, column, mergeAuthors) {

    if (column.key === "authors") {

        if (mergeAuthors) {

            if (record.authorsMerged) return record.authorsMerged;

            if (Array.isArray(record.authors)) {
                return record.authors
                    .map(a => a.displayName ?? a.name ?? "")
                    .filter(Boolean)
                    .join(", ");
            }

            return "";
        }

        if (Array.isArray(record.authors)) {
            return record.authors
                .map(a => a.displayName ?? a.name ?? "")
                .filter(Boolean)
                .join(", ");
        }

        return "";
    }

    const value = record[column.field];

    if (value === null || value === undefined) return "";

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

    return value;

}

export default function PublicationExport({
    records,
    columns,
    mergeAuthors,
    publicationType,
    exporting,
    onExportStart,
    onExportEnd
}) {

    async function handleExport() {

        if (!records || records.length === 0) {
            alert("No records match the current filters to export.");
            return;
        }

        if (onExportStart) onExportStart();

        try {

            const exportRows = records.map(record => {

                const row = {};

                columns.forEach(column => {
                    row[column.label] = getExportValue(record, column, mergeAuthors);
                });

                return row;

            });

            const worksheet = XLSX.utils.json_to_sheet(exportRows);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                publicationType || "Publication"
            );

            const date = new Date().toISOString().slice(0, 10);

            XLSX.writeFile(
                workbook,
                `${publicationType || "publication"}-data-${date}.xlsx`
            );

        } catch (error) {

            console.error("Export failed:", error);
            alert("Export failed. Please try again.");

        } finally {

            if (onExportEnd) onExportEnd();

        }

    }

    return (

        <button
            onClick={handleExport}
            disabled={exporting || !records || records.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >

            <Download size={18} />

            {exporting ? "Exporting..." : "Export Excel"}

        </button>

    );

}