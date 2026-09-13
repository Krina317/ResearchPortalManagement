import React, { useMemo, useState } from "react";

function getValue(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return "—";
  }

  return value;
}

function parsePublicationDetails(details) {
  if (!details) {
    return {
      title: "",
      publicationType: "",
      publicationStatus: "",
      doiLink: "",
      jointPublication: "",
    };
  }

  const text = String(details);

  const getField = (label) => {
    const regex = new RegExp(
      `${label}:\\s*(.*?)(?=\\n[A-Za-z ]+:|$)`,
      "i"
    );

    const match = text.match(regex);

    return match ? match[1].trim() : "";
  };

  return {
    title: getField("Title"),
    publicationType: getField("Publication Type"),
    publicationStatus: getField("Publication Status"),
    doiLink: getField("DOI Link"),
    jointPublication: getField(
      "Joint Publication Yes/No"
    ),
  };
}

function PublicationDetails({ details }) {
  const publication = parsePublicationDetails(details);

  const hasDetails =
    publication.title ||
    publication.publicationType ||
    publication.publicationStatus ||
    publication.doiLink ||
    publication.jointPublication;

  if (!hasDetails) {
    return <span style={styles.empty}>—</span>;
  }

  return (
    <div style={styles.publicationDetails}>
      <div>
        <strong>Title:</strong>{" "}
        {getValue(publication.title)}
      </div>

      <div>
        <strong>Publication Type:</strong>{" "}
        {getValue(publication.publicationType)}
      </div>

      <div>
        <strong>Publication Status:</strong>{" "}
        {getValue(publication.publicationStatus)}
      </div>

      <div>
        <strong>DOI Link:</strong>{" "}
        {publication.doiLink ? (
          <a
            href={publication.doiLink}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            {publication.doiLink}
          </a>
        ) : (
          "—"
        )}
      </div>

      <div>
        <strong>Joint Publication:</strong>{" "}
        {getValue(publication.jointPublication)}
      </div>
    </div>
  );
}

function SortIcon({ active, direction }) {
  if (!active) {
    return (
      <span style={styles.sortIcon}>
        ↕
      </span>
    );
  }

  return (
    <span style={styles.sortIcon}>
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );
}

export default function ProjectTable({
  projects = [],
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const sortedProjects = useMemo(() => {
    const data = [...projects];

    if (!sortConfig.key) {
      return data;
    }

    data.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortConfig.key === "sr") {
        valueA = Number(a.id ?? 0);
        valueB = Number(b.id ?? 0);
      }

      if (sortConfig.key === "amount") {
        valueA = Number(a.amount ?? 0);
        valueB = Number(b.amount ?? 0);
      }

      if (valueA < valueB) {
        return sortConfig.direction === "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return sortConfig.direction === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return data;
  }, [projects, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((previous) => {
      if (previous.key === key) {
        return {
          key,
          direction:
            previous.direction === "asc"
              ? "desc"
              : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  };

  if (!projects || projects.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyTitle}>
          No NU funded projects found
        </div>

        <div style={styles.emptyText}>
          Add a project to see it here.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th
              style={{
                ...styles.th,
                ...styles.sortableHeader,
              }}
              onClick={() => handleSort("sr")}
            >
              <div style={styles.headerContent}>
                <span>Sr. No.</span>

                <SortIcon
                  active={sortConfig.key === "sr"}
                  direction={sortConfig.direction}
                />
              </div>
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
                ...styles.sortableHeader,
              }}
              onClick={() => handleSort("amount")}
            >
              <div style={styles.headerContent}>
                <span>Amount</span>

                <SortIcon
                  active={sortConfig.key === "amount"}
                  direction={sortConfig.direction}
                />
              </div>
            </th>

            <th style={styles.th}>
              NU-Minor / NU-Major
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
          </tr>
        </thead>

        <tbody>
          {sortedProjects.map((project, index) => (
            <tr
              key={project.id ?? index}
              style={styles.tr}
            >
              {/* Sr No */}
              <td style={styles.td}>
                {index + 1}
              </td>

              {/* PI */}
              <td style={styles.td}>
                {getValue(
                  project.principalInvestigator
                )}
              </td>

              {/* Co PI */}
              <td style={styles.td}>
                {getValue(
                  project.coPrincipalInvestigatorList
                )}
              </td>

              {/* Project Title */}
              <td
                style={{
                  ...styles.td,
                  ...styles.titleCell,
                }}
              >
                {getValue(project.projectTitle)}
              </td>

              {/* Amount */}
              <td style={styles.td}>
                {project.amount !== null &&
                project.amount !== undefined &&
                project.amount !== "" ? (
                  <>
                    ₹{" "}
                    {Number(
                      project.amount
                    ).toLocaleString("en-IN")}
                  </>
                ) : (
                  "—"
                )}
              </td>

              {/* Category */}
              <td style={styles.td}>
                {getValue(
                  project.projectCategory
                )}
              </td>

              {/* Duration */}
              <td style={styles.td}>
                {project.duration !== null &&
                project.duration !== undefined &&
                project.duration !== ""
                  ? `${project.duration} ${
                      Number(project.duration) === 1
                        ? "Year"
                        : "Years"
                    }`
                  : "—"}
              </td>

              {/* Outcome */}
              <td
                style={{
                  ...styles.td,
                  ...styles.longTextCell,
                }}
              >
                {getValue(
                  project.outcomeOfResearchProject
                )}
              </td>

              {/* Publication */}
              <td
                style={{
                  ...styles.td,
                  ...styles.publicationCell,
                }}
              >
                <PublicationDetails
                  details={
                    project.publishedPaperDetails
                  }
                />
              </td>

              {/* Proof */}
              <td style={styles.td}>
                {project.jointPublicationProof ? (
                  <a
                    href={
                      project.jointPublicationProof
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.proofLink}
                  >
                    View Proof
                  </a>
                ) : (
                  "—"
                )}
              </td>

              {/* UG Students */}
              <td
                style={{
                  ...styles.td,
                  ...styles.longTextCell,
                }}
              >
                {getValue(
                  project.ugStudentDetailList
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  table: {
    width: "100%",
    minWidth: "1500px",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  th: {
    padding: "13px 14px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontWeight: 650,
    color: "#374151",
    whiteSpace: "nowrap",
    verticalAlign: "top",
  },

  sortableHeader: {
    cursor: "pointer",
    userSelect: "none",
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  sortIcon: {
    color: "#6b7280",
    fontSize: "14px",
  },

  td: {
    padding: "13px 14px",
    borderBottom: "1px solid #f0f0f0",
    color: "#374151",
    verticalAlign: "top",
    lineHeight: 1.5,
  },

  tr: {
    backgroundColor: "#ffffff",
  },

  titleCell: {
    fontWeight: 600,
    minWidth: "220px",
  },

  longTextCell: {
    minWidth: "220px",
    maxWidth: "320px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  publicationCell: {
    minWidth: "340px",
    maxWidth: "400px",
  },

  publicationDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    whiteSpace: "normal",
    lineHeight: 1.45,
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    wordBreak: "break-all",
  },

  proofLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  empty: {
    color: "#9ca3af",
  },

  emptyState: {
    padding: "50px 20px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  emptyTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#374151",
  },

  emptyText: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#9ca3af",
  },
};