// Use the same base URL your old api files used
const API_BASE_URL = "http://localhost:8080/api";

const JSON_HEADERS = { "Content-Type": "application/json" };

const buildQueryString = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });

  return query.toString();
};

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const body = await response.json();
      message = body.message || body.error || fallbackMessage;
    } catch {
      // response had no JSON body, keep the fallback message
    }

    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
};

export const createProjectApi = (resource) => {
  const baseUrl = `${API_BASE_URL}/${resource}`;

  return {
    fetchWithFilters: async ({ params = {}, page, size, sortBy, direction }) => {
      const query = buildQueryString({
        ...params,
        page,
        size,
        sortBy,
        direction,
      });

      const response = await fetch(`${baseUrl}/filter?${query}`);
      return handleResponse(response, "Failed to load projects.");
    },

    getAll: async () => {
      const response = await fetch(baseUrl);
      return handleResponse(response, "Failed to load projects.");
    },

    getById: async (id) => {
      const response = await fetch(`${baseUrl}/${id}`);
      return handleResponse(response, "Failed to load project.");
    },

    create: async (data) => {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
      return handleResponse(response, "Failed to create project.");
    },

    update: async (id, data) => {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
      return handleResponse(response, "Failed to update project.");
    },

    remove: async (id) => {
      const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      return handleResponse(response, "Failed to delete project.");
    },
  };
};

export const nuProjectApi = createProjectApi("nu-funded-projects");
export const extProjectApi = createProjectApi("external-funded-projects");