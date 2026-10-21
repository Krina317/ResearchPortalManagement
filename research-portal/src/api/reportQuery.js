function yearStart(value) {
    if (value === undefined || value === null || value === "") return undefined;
    const n = Number(String(value).split("-")[0]);
    return Number.isNaN(n) ? undefined : n;
}

/* Builds "?academicYear=2025&..." from the report filter state; empty values are skipped. */
export function reportQuery(filters = {}) {
    const params = new URLSearchParams();

    const add = (key, value) => {
        if (value === undefined || value === null || value === "" || value === "All") return;
        params.append(key, value);
    };

    add("academicYear", yearStart(filters.academicYear));
    add("financialYear", yearStart(filters.financialYear));
    add("calendarYear", yearStart(filters.calendarYear));
    add("fromDate", filters.fromDate);
    add("toDate", filters.toDate);
    add("fromMonth", filters.fromMonth);
    add("fromYear", filters.fromYear);
    add("toMonth", filters.toMonth);
    add("toYear", filters.toYear);

    const query = params.toString();
    return query ? `?${query}` : "";
}