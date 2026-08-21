// dashboardApi.js
const BASE_URL = "http://localhost:8080/api";

export async function fetchDashboardSummary() {

    const response = await fetch(`${BASE_URL}/dashboard/count`);

    if (!response.ok) {
        throw new Error("Unable to fetch dashboard.");
    }

    const conferenceCount = await response.json();

    return {
        conferenceCount,
        journalCount: 0,
        bookChapterCount: 0,
        lastUploadDate: null
    };

}