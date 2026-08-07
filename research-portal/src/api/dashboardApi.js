
const BASE_URL = "http://localhost:8080/api";

export async function fetchDashboardSummary() {

    const response = await fetch(`${BASE_URL}/dashboard/summary`);

    if (!response.ok) {
        throw new Error("Unable to fetch dashboard.");
    }

    return response.json();

}
