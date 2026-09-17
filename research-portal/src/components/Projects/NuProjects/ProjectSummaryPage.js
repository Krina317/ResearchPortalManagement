import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchYearlySummaries,
  fetchProjectsSanctionedInYear,
} from "../../../api/projectApi";

function ProjectSummaryPage() {
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState([]);
  const [projectsByYear, setProjectsByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all academic-year summaries
        const yearlySummaries = await fetchYearlySummaries();

        setSummaries(yearlySummaries);

        // Get detailed projects for every academic year
        const details = {};

        await Promise.all(
          yearlySummaries.map(async (summary) => {
            const projects =
              await fetchProjectsSanctionedInYear(
                summary.academicYear
              );

            details[summary.academicYear] = projects;
          })
        );

        setProjectsByYear(details);

      } catch (err) {
        console.error("Summary loading error:", err);
        setError(err.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const formatAmount = (amount) => {
    if (amount == null) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
        }}
      >
        Loading summary...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/projects/nu")}
          style={{
            marginBottom: "20px",
            padding: "10px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← Back to NU Funded Projects
        </button>

        <div
          style={{
            padding: "15px",
            border: "1px solid #f5c2c7",
            borderRadius: "8px",
            background: "#f8d7da",
            color: "#842029",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            NU Funded Projects Summary
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            Summary of all academic years available in the database
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/projects/nu")}
          style={{
            padding: "10px 18px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "white",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ← Back to NU Funded Projects
        </button>
      </div>

      {/* ===================================================== */}
      {/* TABLE 1 - YEARLY SUMMARY */}
      {/* ===================================================== */}

      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            marginBottom: "15px",
            fontSize: "21px",
          }}
        >
          Year-wise Summary
        </h2>

        {summaries.length === 0 ? (
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              color: "#666",
            }}
          >
            No academic year data available.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "700px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      background: "#f5f5f5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Metric
                  </th>

                  {summaries.map((summary) => (
                    <th
                      key={summary.academicYear}
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                        background: "#f5f5f5",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {summary.academicYear}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "600",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Total Projects
                  </td>

                  {summaries.map((summary) => (
                    <td
                      key={summary.academicYear}
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {summary.totalProjects}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "600",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Sanctioned Projects
                  </td>

                  {summaries.map((summary) => (
                    <td
                      key={summary.academicYear}
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {summary.sanctionedProjects}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Sanctioned Amount
                  </td>

                  {summaries.map((summary) => (
                    <td
                      key={summary.academicYear}
                      style={{
                        padding: "14px",
                        textAlign: "center",
                      }}
                    >
                      {formatAmount(
                        summary.sanctionedAmount
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* TABLE 2 - DETAILED PROJECTS FOR EVERY YEAR */}
      {/* ===================================================== */}

      <div>
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "21px",
          }}
        >
          Projects Sanctioned by Academic Year
        </h2>

        {summaries.map((summary) => {
          const academicYear = summary.academicYear;
          const projects =
            projectsByYear[academicYear] || [];

          return (
            <div
              key={academicYear}
              style={{
                marginBottom: "40px",
              }}
            >
              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                {academicYear}
              </h3>

              <div
                style={{
                  overflowX: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={headerStyle}>
                        Sr. No.
                      </th>

                      <th style={headerStyle}>
                        Project Title
                      </th>

                      <th style={headerStyle}>
                        Principal Investigator
                      </th>

                      <th style={headerStyle}>
                        Co-Principal Investigator
                      </th>

                      <th style={headerStyle}>
                        Amount
                      </th>

                      <th style={headerStyle}>
                        Category
                      </th>

                      <th style={headerStyle}>
                        Duration
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#777",
                          }}
                        >
                          No projects sanctioned in this
                          academic year.
                        </td>
                      </tr>
                    ) : (
                      projects.map((project, index) => (
                        <tr key={project.id}>
                          <td style={cellStyle}>
                            {index + 1}
                          </td>

                          <td style={cellStyle}>
                            {project.projectTitle}
                          </td>

                          <td style={cellStyle}>
                            {project.principalInvestigator}
                          </td>

                          <td style={cellStyle}>
                            {project.coPrincipalInvestigatorList}
                          </td>

                          <td style={cellStyle}>
                            {formatAmount(project.amount)}
                          </td>

                          <td style={cellStyle}>
                            {project.projectCategory}
                          </td>

                          <td style={cellStyle}>
                            {project.duration} year
                            {project.duration !== 1
                              ? "s"
                              : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const headerStyle = {
  padding: "12px",
  textAlign: "left",
  background: "#f5f5f5",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

export default ProjectSummaryPage;