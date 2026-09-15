const BASE_URL = "http://localhost:8080/api/nu-funded-projects";

export const fetchProjects = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch NU funded projects");
  }

  return response.json();
};

export const fetchProjectById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

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
    throw new Error(errorText || "Failed to create project");
  }

  return response.json();
};

export const updateProject = async (id, projectData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update project");
  }

  return response.json();
};

export const deleteProject = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete project");
  }
};

export const fetchProjectsWithFilters = async ({
  pi,
  coPi,
  minAmount,
  maxAmount,
  projectCategory,
  minDuration,
  maxDuration,
  academicYear,
  outcome,
  page = 0,
  size = 10,
  sortBy = "id",
  direction = "asc",
}) => {
  const params = new URLSearchParams();

  if (pi) params.append("pi", pi);
  if (coPi) params.append("coPi", coPi);

  if (minAmount !== "" && minAmount != null) {
    params.append("minAmount", minAmount);
  }

  if (maxAmount !== "" && maxAmount != null) {
    params.append("maxAmount", maxAmount);
  }

  if (projectCategory) {
    params.append("projectCategory", projectCategory);
  }

  if (minDuration !== "" && minDuration != null) {
    params.append("minDuration", minDuration);
  }

  if (maxDuration !== "" && maxDuration != null) {
    params.append("maxDuration", maxDuration);
  }

  if (academicYear) {
    params.append("academicYear", academicYear);
  }

  if (outcome) {
    params.append("outcome", outcome);
  }

  params.append("page", page);
  params.append("size", size);
  params.append("sortBy", sortBy);
  params.append("direction", direction);

  const response = await fetch(
    `${BASE_URL}/filter?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch filtered projects");
  }

  return response.json();
};


// ---------------- SUMMARY ----------------

export const fetchYearlySummaries = async () => {
    const response = await fetch(`${BASE_URL}/summary`);
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Failed to fetch yearly summaries"
      );
    }
  
    return response.json();
  };

export const fetchProjectsSanctionedInYear = async (academicYear) => {
  const response = await fetch(
    `${BASE_URL}/summary/${encodeURIComponent(
      academicYear
    )}/projects`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch projects sanctioned in academic year"
    );
  }

  return response.json();
};