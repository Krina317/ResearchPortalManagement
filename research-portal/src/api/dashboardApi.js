// dashboardApi.js

const BASE_URL = "http://localhost:8080/api";

export async function fetchDashboardSummary() {

    const [
        conferenceResponse,
        journalResponse,
        nuProjectResponse
    ] = await Promise.all([
        fetch(`${BASE_URL}/dashboard/count/conference`),
        fetch(`${BASE_URL}/dashboard/count/journal`),
        fetch(`${BASE_URL}/dashboard/count/nu-funded-projects`)
    ]);

    if (
        !conferenceResponse.ok ||
        !journalResponse.ok ||
        !nuProjectResponse.ok
    ) {
        throw new Error("Unable to fetch dashboard.");
    }

    const conferenceCount = await conferenceResponse.json();
    const journalCount = await journalResponse.json();
    const nuProjectCount = await nuProjectResponse.json();

    return {
        conferenceCount,
        journalCount,
        bookChapterCount: 0,

        externalProjectCount: 0,
        externalProjectAmount: 0,

        nuProjectCount,
        nuProjectAmount: 0,

        consultancyCount: 0,
        mouCount: 0
    };
}