import { FILTER_TYPES } from "../config/filterConfig";

const normalize = (column) => {
    return column
        .toLowerCase()
        .replace(/[\s_.()-]/g, "");
};

const containsAny = (text, words) => {
    return words.some(word => text.includes(word));
};

export const analyzeColumns = (columns, data) => {

    const filters = [];

    const authorColumns = [];

    let fromDateColumn = null;
    let toDateColumn = null;

    let singleDateColumn = null;

    let monthColumn = null;
    let yearColumn = null;

    let departmentColumn = null;

    columns.forEach(column => {

        const name = normalize(column);

        // ----------------------------
        // Ignore unwanted columns
        // ----------------------------

        if (
            containsAny(name, [
                "filename",
                "file",
                "download",
                "website",
                "url",
                "link",
                "pdf",
                "doi",
                "attachment"
            ])
        ) {
            return;
        }

        // ----------------------------
        // Author columns
        // ----------------------------

        if (/^author\d+$/.test(name)) {
            authorColumns.push(column);
            return;
        }

        // ----------------------------
        // From Date
        // ----------------------------

        if (
            containsAny(name, [
                "fromdate",
                "startdate"
            ])
        ) {
            fromDateColumn = column;
            return;
        }

        // ----------------------------
        // To Date
        // ----------------------------

        if (
            containsAny(name, [
                "todate",
                "enddate"
            ])
        ) {
            toDateColumn = column;
            return;
        }

        // ----------------------------
        // Single "date"-ish column
        // (e.g. "Date", "Submission Date", "Publish Date")
        // Only used as fallback if no explicit from/to pair
        // or month/year pair is found.
        // ----------------------------

        if (
            name.includes("date") &&
            !singleDateColumn
        ) {
            singleDateColumn = column;
            return;
        }

        // ----------------------------
        // Month
        // ----------------------------

        if (name.includes("month")) {
            monthColumn = column;

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.DROPDOWN,
                column
            });

            return;
        }

        // ----------------------------
        // Year
        // ----------------------------

        if (name.includes("year")) {
            yearColumn = column;

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.DROPDOWN,
                column
            });

            return;
        }

        // ----------------------------
        // Department
        // ----------------------------

        if (
            containsAny(name, [
                "department",
                "dept"
            ])
        ) {

            departmentColumn = column;

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.DROPDOWN,
                column
            });

            return;
        }

        // ----------------------------
        // Institute
        // ----------------------------

        if (
            containsAny(name, [
                "institute",
                "institution",
                "inst"
            ])
        ) {

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.DROPDOWN,
                column
            });

            return;
        }

        // ----------------------------
        // ID
        // ----------------------------

        if (
            name === "id" ||
            name === "srno" ||
            name === "serialno"
        ) {

            filters.push({
                id: "id",
                label: column,
                type: FILTER_TYPES.ID,
                column
            });

            return;
        }

        // ----------------------------
        // Count distinct values
        // ----------------------------

        const distinctValues = new Set(
            data
                .map(row => row[column])
                .filter(v => v !== "" && v !== null && v !== undefined)
        );

        const distinctCount = distinctValues.size;

        // ----------------------------
        // Automatic dropdown
        // ----------------------------

        if (distinctCount <= 20) {

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.DROPDOWN,
                column
            });

        }

        // ----------------------------
        // Automatic text
        // ----------------------------

        else {

            filters.push({
                id: name,
                label: column,
                type: FILTER_TYPES.TEXT,
                column
            });

        }

    });

    // =====================================
    // Author Filter
    // =====================================

    if (authorColumns.length > 0) {

        filters.push({

            id: "author",

            label: "Author",

            type: FILTER_TYPES.AUTHOR,

            columns: authorColumns

        });

    }

    // =====================================
    // Department Group
    // =====================================

    if (departmentColumn) {

        filters.push({

            id: "departmentGroup",

            label: "Department Group",

            type: FILTER_TYPES.DEPARTMENT_GROUP,

            column: departmentColumn

        });

    }

    // =====================================
    // Date Range
    // =====================================

    if (fromDateColumn && toDateColumn) {

        filters.push({

            id: "dateRange",

            label: "Date Range",

            type: FILTER_TYPES.DATE_RANGE,

            mode: "full",

            fromColumn: fromDateColumn,

            toColumn: toDateColumn

        });

    }

    else if (monthColumn && yearColumn) {

        filters.push({

            id: "dateRange",

            label: "Date Range",

            type: FILTER_TYPES.DATE_RANGE,

            mode: "monthYear",

            monthColumn,

            yearColumn

        });

    }

    // Fallback: a single date-ish column (e.g. "Date") with no
    // explicit from/to or month/year pair found. Use it as both
    // the start and end column so range filtering still works.
    else if (singleDateColumn) {

        filters.push({

            id: "dateRange",

            label: "Date Range",

            type: FILTER_TYPES.DATE_RANGE,

            mode: "full",

            fromColumn: singleDateColumn,

            toColumn: singleDateColumn

        });

    }

    return filters;

};