import React from "react";

function ProjectTable({
  projects = [],
  sortBy = "id",
  direction = "asc",
  onSort,
  onEdit,
  onDelete,
}) {
  const getValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return value;
  };

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "—";
    }

    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };

  const getSortSymbol = (field) => {
    if (sortBy !== field) {
      return "↕";
    }

    return direction === "asc" ? "↑" : "↓";
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "1750px",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
              }}
            >
              <th style={styles.th}>
                Sr. No.
              </th>

              <th style={styles.th}>
                PI
              </th>

              <th style={styles.th}>
                Co-PI
              </th>

              <th style={styles.th}>
                Project Title
              </th>

              <th
                style={{
                  ...styles.th,
                  cursor: "pointer",
                }}
                onClick={() => onSort("amount")}
              >
                Amount {getSortSymbol("amount")}
              </th>

              <th style={styles.th}>
                NU-Minor / NU-Major
              </th>

              <th style={styles.th}>
                Academic Year
              </th>

              <th style={styles.th}>
                Duration in Year
              </th>

              <th style={styles.th}>
                Outcome of the Project
              </th>

              <th style={styles.th}>
                Publication Details
              </th>

              <th style={styles.th}>
                Joint Publication Proof
              </th>

              <th style={styles.th}>
                UG Student Details
              </th>

              <th style={styles.th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan="13"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr
                  key={project.id ?? index}
                  style={{
                    borderTop:
                      "1px solid #f3f4f6",
                  }}
                >
                  <td style={styles.td}>
                    {project.id}
                  </td>

                  <td style={styles.td}>
                    {getValue(
                      project.principalInvestigator
                    )}
                  </td>

                  <td style={styles.td}>
                    {getValue(
                      project.coPrincipalInvestigatorList
                    )}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "600",
                      color: "#111827",
                      maxWidth: "320px",
                    }}
                  >
                    {getValue(
                      project.projectTitle
                    )}
                  </td>

                  <td style={styles.td}>
                    {formatAmount(project.amount)}
                  </td>

                  <td style={styles.td}>
                    {getValue(
                      project.projectCategory
                    )}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "600",
                    }}
                  >
                    {getValue(
                      project.academicYear
                    )}
                  </td>

                  <td style={styles.td}>
                    {project.duration !== null &&
                    project.duration !== undefined &&
                    project.duration !== ""
                      ? `${project.duration} ${
                          Number(project.duration) ===
                          1
                            ? "Year"
                            : "Years"
                        }`
                      : "—"}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      maxWidth: "300px",
                    }}
                  >
                    {getValue(
                      project.outcomeOfResearchProject
                    )}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      maxWidth: "300px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {getValue(
                      project.publishedPaperDetails
                    )}
                  </td>

                  <td style={styles.td}>
                    {project.jointPublicationProof ? (
                      <a
                        href={
                          project.jointPublicationProof
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#059669",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        View Proof
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      maxWidth: "250px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {getValue(
                      project.ugStudentDetailList
                    )}
                  </td>

                  {/* ACTIONS FOR THIS ROW ONLY */}
                  <td
                    style={{
                      ...styles.td,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(project)
                        }
                        style={{
                          padding: "7px 12px",
                          border: "1px solid #2563eb",
                          borderRadius: "6px",
                          backgroundColor: "#fff",
                          color: "#2563eb",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(project)
                        }
                        style={{
                          padding: "7px 12px",
                          border: "1px solid #dc2626",
                          borderRadius: "6px",
                          backgroundColor: "#fff",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  th: {
    padding: "13px 14px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#4b5563",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "13px 14px",
    fontSize: "14px",
    color: "#374151",
    verticalAlign: "top",
  },
};

export default ProjectTable;