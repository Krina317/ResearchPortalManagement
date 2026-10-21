const BASE_URL = "http://localhost:8080/api";

export async function fetchFacultyList() {
  const response = await fetch(`${BASE_URL}/faculty-metrics/faculty`);

  if (!response.ok) {
    throw new Error("Unable to fetch faculty list.");
  }

  return response.json();
}

export async function scrapeFacultyMetrics() {
  const response = await fetch(`${BASE_URL}/faculty-metrics/scrape`, {
    method: "POST",
  });

  if (response.status === 409) {
    throw new Error("A refresh is already running. Please wait a moment.");
  }
  if (!response.ok) {
    throw new Error("Unable to fetch faculty metrics.");
  }

  return response.json();
}