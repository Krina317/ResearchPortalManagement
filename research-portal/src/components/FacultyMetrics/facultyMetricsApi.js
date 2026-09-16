const BASE_URL = "http://localhost:8080/api";

export async function fetchFacultyList() {

  const response = await fetch(
    `${BASE_URL}/faculty`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch faculty list.");
  }

  return response.json();
}


export async function scrapeFacultyMetrics() {

  const response = await fetch(
    `${BASE_URL}/faculty-metrics/scrape`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to scrape faculty metrics.");
  }

  return response.json();
}