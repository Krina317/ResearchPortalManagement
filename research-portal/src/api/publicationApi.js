import { getDepartmentLabel } from "../config/publicationConfig";

const BASE_URL = "http://localhost:8080/api";

const ENDPOINTS = {
    conference: "conference",
    journal: "journal"
    // "book-chapters": not implemented on backend yet
};

function yearStart(value) {
    // Frontend stores academic/financial year as "2025-26" -> backend wants 2025
    if (value === undefined || value === null || value === "") return undefined;
    const start = String(value).split("-")[0];
    const n = Number(start);
    return Number.isNaN(n) ? undefined : n;
}

function add(params, key, value) {
    if (value === undefined || value === null || value === "" || value === "All") return;
    params.append(key, value);
}

function addCommonParams(params, filters, { page, size, sortBy, sortDir }) {

    add(params, "instituteName", filters.instituteName);
    add(params, "authorName", filters.authorName);

    (filters.department ?? []).forEach(d => params.append("department", d));

    (filters.authorPositions ?? []).forEach(p => {
        const n = Number(p);
        if (!Number.isNaN(n)) params.append("authorPosition", n);
    });

    const academicYear = yearStart(filters.academicYear);
    if (academicYear !== undefined) params.append("academicYear", academicYear);

    const financialYear = yearStart(filters.financialYear);
    if (financialYear !== undefined) params.append("financialYear", financialYear);

    const calendarYear = yearStart(filters.calendarYear);
    if (calendarYear !== undefined) params.append("calendarYear", calendarYear);

    if (page !== undefined) params.append("page", page);
    if (size !== undefined) params.append("size", size);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDir) params.append("sortDir", sortDir);

}

/*
|--------------------------------------------------------------------------
| Conference params - matches ConferenceQueryController.
|--------------------------------------------------------------------------
*/
function buildConferenceParams(filters = {}, opts = {}) {

    const params = new URLSearchParams();

    add(params, "conferenceName", filters.conferenceName);
    add(params, "paperTitle", filters.paperTitle);
    add(params, "conferenceType", filters.conferenceType);
    add(params, "fromDate", filters.fromDate);
    add(params, "toDate", filters.toDate);

    addCommonParams(params, filters, opts);

    return params;

}

/*
|--------------------------------------------------------------------------
| Journal params - matches JournalQueryController (confirmed): paperTitle,
| journalName, journalType, department, instituteName, authorName,
| authorPosition, fromYear, fromMonth, toYear, toMonth, academicYear,
| financialYear, calendarYear.
|
| The frontend's MonthRangeFilter only has ONE `year` field (used for
| both ends of the range), so it's sent as both fromYear and toYear here.
|--------------------------------------------------------------------------
*/
function buildJournalParams(filters = {}, opts = {}) {

    const params = new URLSearchParams();

    add(params, "paperTitle", filters.paperTitle);
    add(params, "journalName", filters.journalName);
    add(params, "journalType", filters.journalType);

    if (filters.fromMonth) {
        add(params, "fromMonth", filters.fromMonth);
        add(params, "fromYear", filters.year);
    }

    if (filters.toMonth) {
        add(params, "toMonth", filters.toMonth);
        add(params, "toYear", filters.year);
    }

    addCommonParams(params, filters, opts);

    return params;

}

const PARAM_BUILDERS = {
    conference: buildConferenceParams,
    journal: buildJournalParams
};

/*
|--------------------------------------------------------------------------
| Normalize per-type response quirks so the rest of the frontend (table,
| export, merge/unmerge) never has to special-case publicationType.
|--------------------------------------------------------------------------
| - Conference's merged-authors field is `authorsMerged`.
| - Journal's is `mergedAuthors` (different name, same shape).
|--------------------------------------------------------------------------
*/
function normalizeRecord(record, publicationType) {

    let result = record;

    if (publicationType === "journal" && record.mergedAuthors !== undefined) {
        result = { ...result, authorsMerged: record.mergedAuthors };
    }

    if (publicationType === "journal" && record.deptCode !== undefined) {
        result = { ...result, deptName: getDepartmentLabel("journal", record.deptCode) };
    }

    return result;

}


/*
|--------------------------------------------------------------------------
| Search / list (paginated)
|--------------------------------------------------------------------------
*/
export async function searchPublication(publicationType, filters, { page, size, sortBy, sortDir } = {}) {

    const endpoint = ENDPOINTS[publicationType];
    const buildParams = PARAM_BUILDERS[publicationType];

    if (!endpoint || !buildParams) {
        throw new Error(`"${publicationType}" isn't wired up on the backend yet.`);
    }

    const params = buildParams(filters, { page, size, sortBy, sortDir });

    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Failed to load ${publicationType} records (HTTP ${response.status}).`);
    }

    const data = await response.json(); // Spring Page: { content, totalElements, totalPages, ... }

    return {
        ...data,
        content: (data.content ?? []).map(r => normalizeRecord(r, publicationType))
    };

}


/*
|--------------------------------------------------------------------------
| Fetch every matching record (for export) - no dedicated "export all"
| endpoint on the backend, so this reuses search with a huge page size.
|--------------------------------------------------------------------------
*/
export async function fetchAllMatchingPublication(publicationType, filters, { sortBy, sortDir } = {}) {

    const endpoint = ENDPOINTS[publicationType];
    const buildParams = PARAM_BUILDERS[publicationType];

    if (!endpoint || !buildParams) {
        throw new Error(`"${publicationType}" isn't wired up on the backend yet.`);
    }

    const params = buildParams(filters, { page: 0, size: 1000000, sortBy, sortDir });

    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Failed to export ${publicationType} records (HTTP ${response.status}).`);
    }

    const data = await response.json();

    return (data.content ?? []).map(r => normalizeRecord(r, publicationType));

}


/*
|--------------------------------------------------------------------------
| Uploads
|--------------------------------------------------------------------------
*/
export async function uploadConferenceFile(file) {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/conference/import`, {
        method: "POST",
        body: formData
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            (typeof data === "string" && data) ||
            data?.message ||
            "Conference upload failed."
        );
    }

    return data;

}

export async function uploadJournalFile(file) {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/journal/import`, {
        method: "POST",
        body: formData
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            (typeof data === "string" && data) ||
            data?.message ||
            "Journal upload failed."
        );
    }

    return data;

}