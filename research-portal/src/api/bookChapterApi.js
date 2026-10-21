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

export const createBookChapter = (payload) =>
    request("/book-chapters", jsonOptions("POST", payload));

export const updateBookChapter = (id, payload) =>
    request(`/book-chapters/${id}`, jsonOptions("PUT", payload));

export const deleteBookChapter = (id) =>
    request(`/book-chapters/${id}`, { method: "DELETE" });