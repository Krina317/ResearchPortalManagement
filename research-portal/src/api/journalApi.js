const BASE_URL = "http://localhost:8080/api";

async function request(path, options) {
    const response = await fetch(`${BASE_URL}${path}`, options);

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Request failed (HTTP ${response.status}).`);
    }

    // 204 No Content (delete, review decision) has no body
    if (response.status === 204) return null;

    return response.json();
}

function jsonOptions(method, body) {
    return {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

/* ---------- Journal CRUD ---------- */

export const createJournal = (payload) =>
    request("/journal", jsonOptions("POST", payload));

export const updateJournal = (id, payload) =>
    request(`/journal/${id}`, jsonOptions("PUT", payload));

export const deleteJournal = (id) =>
    request(`/journal/${id}`, { method: "DELETE" });

/* ---------- Student type (UG / PG / PHD, or "" to clear) ---------- */

export const setStudentType = (linkId, studentType) =>
    request(
        `/journal-authors/${linkId}/student-type`,
        jsonOptions("PUT", { studentType })
    );

/* ---------- Reports ---------- */

export const fetchFacultyScores = () => request("/journal/reports/faculty-scores");

export const fetchStudentCounts = () => request("/journal/reports/student-counts");

export const fetchReviewAuthors = () => request("/journal/reports/review-authors");
