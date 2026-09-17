// dashboardApi.js

const BASE_URL = "http://localhost:8080/api";

export async function fetchDashboardSummary() {

    const [
        conferenceResponse,
        journalResponse,
        nuProjectResponse,
        extProjectResponse
    ] = await Promise.all([
        fetch(`${BASE_URL}/dashboard/count/conference`),
        fetch(`${BASE_URL}/dashboard/count/journal`),
        fetch(`${BASE_URL}/dashboard/count/nu-funded-projects`),
        fetch(`${BASE_URL}/dashboard/count/ext-funded-projects`)
    ]);

    if (
        !conferenceResponse.ok ||
        !journalResponse.ok ||
        !nuProjectResponse.ok ||
        !extProjectResponse.ok
    ) {
        throw new Error("Unable to fetch dashboard.");
    }

    const conferenceCount = await conferenceResponse.json();
    const journalCount = await journalResponse.json();
    const nuProjectCount = await nuProjectResponse.json();
    const externalProjectCount = await extProjectResponse.json();

    return {
        conferenceCount,
        journalCount,
        bookChapterCount: 0,

        externalProjectCount,
        externalProjectAmount: 0,

        nuProjectCount,
        nuProjectAmount: 0,

        consultancyCount: 0,
        mouCount: 0
    };
}