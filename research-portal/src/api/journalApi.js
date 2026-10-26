import { reportQuery } from "./reportQuery";
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

export const fetchFacultyScores = (filters) =>
    request(`/journal/reports/faculty-scores${reportQuery(filters)}`);

export const fetchStudentCounts = (filters) =>
    request(`/journal/reports/student-counts${reportQuery(filters)}`);

export const fetchJournalCharts = (filters) =>
    request(`/journal/reports/charts${reportQuery(filters)}`);

export const fetchReviewAuthors = () => request("/journal/reports/review-authors");

/* Review decision: isFaculty true = confirm the suggested match, false = not faculty. */
export const decideReviewAuthor = (authorId, isFaculty, facultyId) =>
    request(
        `/journal/reports/review-authors/${authorId}`,
        jsonOptions("PUT", facultyId != null ? { isFaculty, facultyId } : { isFaculty })
    );

export const setJournalQuartile = (id, quartile) =>
request(`/journal/${id}/quartile`, jsonOptions("PUT", { quartile }));

// TEMP: mock data until the backend endpoint exists
export async function fetchJournalStatistics() {
    return [
        { facultyId: 1, facultyName: "Dr. A. Sharma", counts: { "2021-22": 62, "2022-23": 58, "2023-24": 71 } },
        { facultyId: 2, facultyName: "Dr. B. Patel", counts: { "2021-22": 45, "2022-23": "NA*", "2023-24": 50 } },
        { facultyId: 3, facultyName: "Dr. C. Mehta", counts: { "2021-22": 33, "2022-23": 41, "2023-24": "NA#" } },
        { facultyId: 4, facultyName: "Dr. D. Shah", counts: { "2021-22": 28, "2022-23": 30, "2023-24": 35 } },
        { facultyId: 5, facultyName: "Dr. E. Joshi", counts: { "2021-22": 19, "2022-23": 22, "2023-24": 27 } },
        { facultyId: 6, facultyName: "Dr. F. Desai", counts: { "2021-22": 12, "2022-23": 15, "2023-24": 18 } },
        { facultyId: 7, facultyName: "Dr. G. Trivedi", counts: { "2021-22": 8, "2022-23": 11, "2023-24": 9 } }
    ];
}