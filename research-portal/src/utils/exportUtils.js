import * as XLSX from "xlsx";

export const exportToExcel = (
    sortedData,
    visibleColumns
) => {

    const exportData = sortedData.map((row) => {

        const newRow = {};

        visibleColumns.forEach((column) => {
            newRow[column] = row[column];
        });

        return newRow;

    });

    const worksheet =
        XLSX.utils.json_to_sheet(exportData);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Filtered Data"
    );

    const today =
        new Date().toISOString().split("T")[0];

    XLSX.writeFile(
        workbook,
        `Research_Data_${today}.xlsx`
    );

};