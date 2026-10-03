const BASE_URL = "http://localhost:8080/api";

async function fetchCount(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`Failed: ${path} (${response.status})`);
    }
    return response.json();
}

export async function fetchDashboardSummary() {
    const paths = [
        "/dashboard/count/conference",
        "/dashboard/count/journal",
        "/dashboard/count/book-chapters",
        "/dashboard/count/nu-funded-projects",
        "/dashboard/count/ext-funded-projects",
    ];

    const results = await Promise.allSettled(paths.map(fetchCount));

    results.forEach((r, i) => {
        if (r.status === "rejected") {
            console.error(`Dashboard endpoint failed: ${paths[i]}`, r.reason);
        }
    });

    if (results.every((r) => r.status === "rejected")) {
        throw new Error("Unable to fetch dashboard.");
    }

    const val = (r) => (r.status === "fulfilled" ? r.value : 0);
    const [conference, journal, bookChapter, nuProject, extProject] = results;

    return {
        conferenceCount: val(conference),
        journalCount: val(journal),
        bookChapterCount: val(bookChapter),

        externalProjectCount: val(extProject),
        externalProjectAmount: 0,

        nuProjectCount: val(nuProject),
        nuProjectAmount: 0,

        consultancyCount: 0,
        mouCount: 0,
    };
}