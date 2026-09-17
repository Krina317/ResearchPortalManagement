const BASE_URL =
  "http://localhost:8080/api/external-funded-projects";

// ============================================================
// CRUD
// ============================================================

// GET ALL PROJECTS
export const fetchProjects = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch external funded projects"
    );
  }

  return response.json();
};


// GET PROJECT BY ID
export const fetchProjectById = async (id) => {
  const response = await fetch(
    `${BASE_URL}/${id}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch external funded project"
    );
  }

  return response.json();
};


// CREATE PROJECT
export const createProject = async (projectData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to create external funded project"
    );
  }

  return response.json();
};


// UPDATE PROJECT
export const updateProject = async (
  id,
  projectData
) => {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(projectData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to update external funded project"
    );
  }

  return response.json();
};


// DELETE PROJECT
export const deleteProject = async (id) => {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to delete external funded project"
    );
  }
};


// ============================================================
// FILTER + PAGINATION
// ============================================================

export const fetchProjectsWithFilters = async ({
  filters = {},
  page = 0,
  size = 10,
  sortBy = "id",
  direction = "asc",
}) => {
  const {
    projectTitle,
    piSearch,
    coPiSearch,
    fundingAgencyName,

    minAmount,
    maxAmount,

    minDuration,
    maxDuration,

    academicYear,

    financialYear,
    calendarYear,

    outcome,
    status,
  } = filters;

  const params = new URLSearchParams();


  // ----------------------------------------------------------
  // TEXT FILTERS
  // ----------------------------------------------------------

  if (projectTitle) {
    params.append(
      "projectTitle",
      projectTitle.trim()
    );
  }

  if (piSearch) {
    params.append(
      "pi",
      piSearch.trim()
    );
  }

  if (coPiSearch) {
    params.append(
      "coPi",
      coPiSearch.trim()
    );
  }

  if (fundingAgencyName) {
    params.append(
      "fundingAgencyName",
      fundingAgencyName.trim()
    );
  }


  // ----------------------------------------------------------
  // AMOUNT FILTERS
  // ----------------------------------------------------------

  if (
    minAmount !== "" &&
    minAmount != null
  ) {
    params.append(
      "minAmount",
      minAmount
    );
  }

  if (
    maxAmount !== "" &&
    maxAmount != null
  ) {
    params.append(
      "maxAmount",
      maxAmount
    );
  }


  // ----------------------------------------------------------
  // DURATION FILTERS
  // ----------------------------------------------------------

  if (
    minDuration !== "" &&
    minDuration != null
  ) {
    params.append(
      "minDuration",
      minDuration
    );
  }

  if (
    maxDuration !== "" &&
    maxDuration != null
  ) {
    params.append(
      "maxDuration",
      maxDuration
    );
  }


  // ----------------------------------------------------------
  // ACADEMIC YEAR
  // ----------------------------------------------------------

  if (academicYear) {
    params.append(
      "academicYear",
      academicYear
    );
  }


  // ----------------------------------------------------------
  // OUTCOME
  // ----------------------------------------------------------

  if (outcome) {
    params.append(
      "outcome",
      outcome
    );
  }


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  if (status) {
    params.append(
      "status",
      status
    );
  }


  // ----------------------------------------------------------
  // FINANCIAL YEAR / CALENDAR YEAR
  // ----------------------------------------------------------
  //
  // Backend expects:
  //
  // dateFrom
  // dateTo
  //
  // Financial Year:
  // 2025-2026 → 2025-04-01 to 2026-03-31
  //
  // Calendar Year:
  // 2025 → 2025-01-01 to 2025-12-31
  //
  // If both are selected, financial year currently
  // takes priority, matching your existing logic.
  // ----------------------------------------------------------

  if (financialYear) {
    const [startYear, endYear] =
      financialYear.split("-");

    params.append(
      "dateFrom",
      `${startYear}-04-01`
    );

    params.append(
      "dateTo",
      `${endYear}-03-31`
    );
  } else if (calendarYear) {
    params.append(
      "dateFrom",
      `${calendarYear}-01-01`
    );

    params.append(
      "dateTo",
      `${calendarYear}-12-31`
    );
  }


  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  params.append(
    "page",
    page
  );

  params.append(
    "size",
    size
  );


  // ----------------------------------------------------------
  // SORTING
  // ----------------------------------------------------------

  params.append(
    "sortBy",
    sortBy
  );

  params.append(
    "direction",
    direction
  );


  // ----------------------------------------------------------
  // API REQUEST
  // ----------------------------------------------------------

  const response = await fetch(
    `${BASE_URL}/filter?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch filtered external funded projects"
    );
  }

  return response.json();
};