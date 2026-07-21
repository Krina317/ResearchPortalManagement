import { FILTER_TYPES } from "../config/filterConfig";
import { departmentGroups } from "../utils/departmentGroups";
// ==========================================
// DISTINCT VALUES
// ==========================================
export const getDistinctValues = (data, column) => {
    return [
        ...new Set(
            data
                .map(row => row[column])
                .filter(v =>
                    v !== "" &&
                    v !== null &&
                    v !== undefined
                )
        )
    ].sort();
};
// ==========================================
// DATE PARSER
// ==========================================
const parseDate = (value) => {
    if (!value) return null;
    // Already JS Date
    if (value instanceof Date)
        return value;
    // Excel Serial Number
    if (!isNaN(value)) {
        return new Date(
            (Number(value) - 25569) * 86400 * 1000
        );
    }
    // dd/mm/yyyy or dd/mm/yy
    if (typeof value === "string") {
        const parts = value.split("/");
        if (parts.length === 3) {
            let p1 = Number(parts[0]);
            let p2 = Number(parts[1]);
            let year = Number(parts[2]);
            if (year < 100)
                year += 2000;

            // Disambiguate dd/mm vs mm/dd: if the first part
            // can't be a month (>12), it must be a day, so treat
            // as dd/mm/yyyy. Otherwise assume mm/dd/yyyy since
            // that's what Excel/XLSX raw:false export typically
            // produces on US locales. Adjust here if your data
            // is consistently dd/mm/yyyy.
            let day, month;
            if (p1 > 12) {
                day = p1;
                month = p2 - 1;
            } else if (p2 > 12) {
                day = p2;
                month = p1 - 1;
            } else {
                // ambiguous, default to mm/dd/yyyy
                month = p1 - 1;
                day = p2;
            }

            return new Date(year, month, day);
        }
    }
    const date = new Date(value);
    if (isNaN(date))
        return null;
    return date;
};
// ==========================================
// TEXT
// ==========================================
const filterText = (
    row,
    filter,
    filters
) => {
    const search = filters[filter.id];
    if (!search)
        return true;
    return String(
        row[filter.column] ?? ""
    ).toLowerCase().includes(
            search.toLowerCase()
        );
};
// ==========================================
// ID
// ==========================================
const filterID = (
    row,
    filter,
    filters
) => {
    const value = filters[filter.id];
    if (!value)
        return true;
    return String(
        row[filter.column]
    ) === String(value);
};
// ==========================================
// DROPDOWN
// ==========================================
const filterDropdown = (
    row,
    filter,
    filters
) => {
    const value = filters[filter.id];
    if (!value)
        return true;
    return String(
        row[filter.column]
    ) === String(value);
};
// ==========================================
// AUTHOR
// ==========================================
const filterAuthor = (
    row,
    filter,
    filters
) => {
    const author =
        filters.authorName;
    const positions =
        filters.authorPositions || [];
    if (
        !author &&
        positions.length === 0
    )
        return true;
    const cols =
        positions.length
            ? positions.map(
                p => filter.columns[p - 1]
            )
            : filter.columns;
    return cols.some(col =>
        String(
            row[col] ?? ""
        )
            .toLowerCase()
            .includes(
                (author || "")
                    .toLowerCase()
            )
    );
};
// ==========================================
// DEPARTMENT GROUP
// ==========================================
const normalizeDept = (value) =>
    String(value ?? "")
        .toLowerCase()
        .replace(/[\s.]+/g, " ")
        .trim();

// Build a lookup of normalized-name -> group key for every
// explicitly named group (everything except OTHER).
const buildNamedDeptLookup = () => {
    const lookup = new Map();
    Object.entries(departmentGroups).forEach(([groupKey, names]) => {
        if (groupKey === "OTHER") return;
        names.forEach(name => {
            lookup.set(normalizeDept(name), groupKey);
        });
    });
    return lookup;
};

const namedDeptLookup = buildNamedDeptLookup();

const filterDepartmentGroup = (
    row,
    filter,
    filters
) => {
    const selected =
        filters.departmentGroup;
    if (!selected)
        return true;

    const rawValue = row[filter.column];
    const normalized = normalizeDept(rawValue);

    const matchedGroup = namedDeptLookup.get(normalized);

    if (selected === "OTHER") {
        // OTHER = anything that didn't match a named group
        return !matchedGroup;
    }

    return matchedGroup === selected;
};
// ==========================================
// DATE RANGE
// ==========================================
const filterDateRange = (
    row,
    filter,
    filters
) => {
    const start =
        parseDate(filters.startDate);
    const end =
        parseDate(filters.endDate);
    if (!start && !end)
        return true;
    // -------- Full Date (single or dual column) --------
    if (filter.mode === "full") {
        const recordStart =
            parseDate(
                row[filter.fromColumn]
            );
        const recordEnd =
            parseDate(
                row[filter.toColumn]
            );
        if (
            !recordStart ||
            !recordEnd
        )
            return false;
        return (
            recordStart <= (end || new Date(8640000000000000))
            &&
            recordEnd >= (start || new Date(-8640000000000000))
        );
    }
    // -------- Month Year --------
    if (filter.mode === "monthYear") {
        const month =
            row[filter.monthColumn];
        const year =
            row[filter.yearColumn];
        if (!month || !year)
            return false;
        const monthMap = {
            january:0,
            february:1,
            march:2,
            april:3,
            may:4,
            june:5,
            july:6,
            august:7,
            september:8,
            october:9,
            november:10,
            december:11
        };
        const monthNumber =
            isNaN(month)
                ? monthMap[
                    String(month)
                        .toLowerCase()
                ]
                : Number(month)-1;
        const recordDate =
            new Date(
                Number(year),
                monthNumber,
                1
            );
        return (
            recordDate >= (start || new Date(-8640000000000000))
            &&
            recordDate <= (end || new Date(8640000000000000))
        );
    }
    return true;
};
// ==========================================
// MAIN
// ==========================================
export const filterData = (
    data,
    filterMetadata,
    filters
) => {
    return data.filter(row => {
        return filterMetadata.every(filter => {
            switch (filter.type) {
                case FILTER_TYPES.ID:
                    return filterID(
                        row,
                        filter,
                        filters
                    );
                case FILTER_TYPES.TEXT:
                    return filterText(
                        row,
                        filter,
                        filters
                    );
                case FILTER_TYPES.DROPDOWN:
                    return filterDropdown(
                        row,
                        filter,
                        filters
                    );
                case FILTER_TYPES.AUTHOR:
                    return filterAuthor(
                        row,
                        filter,
                        filters
                    );
                case FILTER_TYPES.DATE_RANGE:
                    return filterDateRange(
                        row,
                        filter,
                        filters
                    );
                case FILTER_TYPES.DEPARTMENT_GROUP:
                    return filterDepartmentGroup(
                        row,
                        filter,
                        filters
                    );
                default:
                    return true;
            }
        });
    });
};