export const sortData = (
    data,
    sortColumn,
    sortDirection
) => {

    if (!sortColumn) return [...data];

    return [...data].sort((a, b) => {

        const valA = a[sortColumn] ?? "";
        const valB = b[sortColumn] ?? "";

        // Check if both values are numbers
        const numA = Number(valA);
        const numB = Number(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
            return sortDirection === "asc"
                ? numA - numB
                : numB - numA;
        }

        // String comparison
        return sortDirection === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));

    });

};