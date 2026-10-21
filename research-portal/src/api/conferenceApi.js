import { reportQuery } from "./reportQuery";
const BASE_URL = "http://localhost:8080/api";

async function request(path, options) {
    const response = await fetch(`${BASE_URL}${path}`, options);

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Request failed (HTTP ${response.status}).`);
    }

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

export const setConferenceStudentType = (linkId, studentType) =>
    request(
        `/conference-authors/${linkId}/student-type`,
        jsonOptions("PUT", { studentType })
    );

export const fetchConferenceFacultyScores = (filters) =>
    request(`/conference/reports/faculty-scores${reportQuery(filters)}`);

export const fetchConferenceStudentCounts = (filters) =>
    request(`/conference/reports/student-counts${reportQuery(filters)}`);

export const fetchConferenceReviewAuthors = () =>
    request("/conference/reports/review-authors");

export const decideConferenceReviewAuthor = (authorId, isFaculty, facultyId) =>
    request(
        `/conference/reports/review-authors/${authorId}`,
        jsonOptions("PUT", facultyId != null ? { isFaculty, facultyId } : { isFaculty })
    );

export const createConference = (payload) =>
    request("/conference", jsonOptions("POST", payload));

export const updateConference = (id, payload) =>
    request(`/conference/${id}`, jsonOptions("PUT", payload));

export const deleteConference = (id) =>
    request(`/conference/${id}`, { method: "DELETE" });

export const setConferenceQuartile = (id, quartile) =>
    request(`/conference/${id}/quartile`, jsonOptions("PUT", { quartile }));