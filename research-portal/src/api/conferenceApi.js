const BASE_URL = "http://localhost:8080/api";

export async function uploadConferenceFile(file) {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/conference/import`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(typeof data === "string" ? data : "Upload failed.");
    }

    return data;

}

export async function searchConferences(filters, { page = 0, size = 10, sortBy = "fromDate", sortDir = "DESC" } = {}) {

    const params = new URLSearchParams();

    if (filters.conferenceName) params.append("conferenceName", filters.conferenceName);
    if (filters.paperTitle) params.append("paperTitle", filters.paperTitle);
    if (filters.conferenceType && filters.conferenceType !== "All") params.append("conferenceType", filters.conferenceType);

    if (filters.departments && filters.departments.length) {
        filters.departments.forEach(d => params.append("department", d));
    }
if (filters.instituteName && filters.instituteName !== "All") params.append("instituteName", filters.instituteName);

    if (filters.authorName) params.append("authorName", filters.authorName);

    if (filters.authorPositions && filters.authorPositions.length) {
        filters.authorPositions.forEach(p => params.append("authorPosition", p));
    }

    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.academicYear) params.append("academicYear", filters.academicYear);
    if (filters.financialYear) params.append("financialYear", filters.financialYear);
    if (filters.calendarYear) params.append("calendarYear", filters.calendarYear);
    params.append("page", page);
    params.append("size", size);
    params.append("sortBy", sortBy);
    params.append("sortDir", sortDir);

    const response = await fetch(`${BASE_URL}/conference?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch conference data.");
    }

    return response.json();

}

export async function fetchAllMatchingConferences(filters) {

    // Pull everything matching the filters in one go for export purposes.
    const result = await searchConferences(filters, {
        page: 0,
        size: 10000,
        sortBy: "fromDate",
        sortDir: "DESC"
    });

    return result.content;

}