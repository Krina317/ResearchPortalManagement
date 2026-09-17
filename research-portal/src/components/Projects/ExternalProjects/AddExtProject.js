import React, { useEffect, useState } from "react";

const ACADEMIC_YEARS = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

const STATUS_OPTIONS = [
  "Ongoing",
  "Completed",
  "Terminated",
];

const OUTCOME_OPTIONS = [
  "Journal Paper Published",
  "Conference Paper Published",
  "None",
  "Any activity performed based on research project",
];

const emptyForm = {
  projectTitle: "",
  principalInvestigator: "",
  coPrincipalInvestigatorList: "",
  fundingAgencyName: "",
  amountTotalSanctioned: "",
  duration: "",
  academicYear: "",
  fromDate: "",
  toDate: "",
  outcomeOfProject: "",
  publishedPaperDetails: "",
  jointPublicationProof: "",
  statusOfTheProject: "",
};

function AddExtProject({
  onClose,
  onSave,
  projectToEdit,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(projectToEdit);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        projectTitle: projectToEdit.projectTitle || "",
        principalInvestigator:
          projectToEdit.principalInvestigator || "",
        coPrincipalInvestigatorList:
          projectToEdit.coPrincipalInvestigatorList || "",
        fundingAgencyName:
          projectToEdit.fundingAgencyName || "",
        amountTotalSanctioned:
          projectToEdit.amountTotalSanctioned ?? "",
        duration:
          projectToEdit.duration ?? "",
        academicYear:
          projectToEdit.academicYear || "",
        fromDate:
          projectToEdit.fromDate || "",
        toDate:
          projectToEdit.toDate || "",
        outcomeOfProject:
          projectToEdit.outcomeOfProject || "",
        publishedPaperDetails:
          projectToEdit.publishedPaperDetails || "",
        jointPublicationProof:
          projectToEdit.jointPublicationProof || "",
        statusOfTheProject:
          projectToEdit.statusOfTheProject || "",
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [projectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const validateForm = () => {
    if (!formData.projectTitle.trim()) {
      return "Project title is required";
    }

    if (!formData.principalInvestigator.trim()) {
      return "Principal investigator is required";
    }

    if (!formData.coPrincipalInvestigatorList.trim()) {
      return "Co-principal investigator list is required";
    }

    if (!formData.fundingAgencyName.trim()) {
      return "Funding agency name is required";
    }

    if (
      formData.amountTotalSanctioned === "" ||
      formData.amountTotalSanctioned === null
    ) {
      return "Sanctioned amount is required";
    }

    if (Number(formData.amountTotalSanctioned) < 0) {
      return "Sanctioned amount cannot be negative";
    }

    if (
      formData.duration === "" ||
      formData.duration === null
    ) {
      return "Duration is required";
    }

    if (Number(formData.duration) < 0) {
      return "Duration cannot be negative";
    }

    if (!formData.academicYear) {
      return "Academic year is required";
    }

    if (!formData.fromDate) {
      return "From date is required";
    }

    if (!formData.toDate) {
      return "To date is required";
    }

    if (formData.fromDate > formData.toDate) {
      return "From date cannot be after to date";
    }

    if (!formData.jointPublicationProof.trim()) {
      return "Joint publication proof is required";
    }

    if (!formData.statusOfTheProject) {
      return "Status of the project is required";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const requestData = {
      projectTitle: formData.projectTitle.trim(),

      principalInvestigator:
        formData.principalInvestigator.trim(),

      coPrincipalInvestigatorList:
        formData.coPrincipalInvestigatorList.trim(),

      fundingAgencyName:
        formData.fundingAgencyName.trim(),

      amountTotalSanctioned:
        Number(formData.amountTotalSanctioned),

      duration:
        Number(formData.duration),

      academicYear:
        formData.academicYear,

      fromDate:
        formData.fromDate,

      toDate:
        formData.toDate,

      outcomeOfProject:
        formData.outcomeOfProject,

      publishedPaperDetails:
        formData.publishedPaperDetails,

      jointPublicationProof:
        formData.jointPublicationProof.trim(),

      statusOfTheProject:
        formData.statusOfTheProject,
    };

    try {
      setSaving(true);
      setError("");

      await onSave(requestData);
    } catch (err) {
      setError(
        err?.message ||
          "Failed to save external funded project"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4b5563",
  };

  const fieldStyle = {
    marginBottom: "14px",
  };

  const buttonStyle = {
    padding: "9px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#fff",
    cursor: "pointer",
    color: "#374151",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "22px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "21px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            {isEditMode
              ? "Edit External Funded Project"
              : "Add External Funded Project"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              border: "none",
              backgroundColor: "transparent",
              fontSize: "20px",
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px 12px",
              borderRadius: "7px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PROJECT TITLE */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Title *
            </label>

            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="Enter project title"
              style={inputStyle}
            />
          </div>

          {/* PI + CO-PI */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Principal Investigator *
              </label>

              <input
                type="text"
                name="principalInvestigator"
                value={formData.principalInvestigator}
                onChange={handleChange}
                placeholder="Enter PI"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Co-Principal Investigator *
              </label>

              <input
                type="text"
                name="coPrincipalInvestigatorList"
                value={
                  formData.coPrincipalInvestigatorList
                }
                onChange={handleChange}
                placeholder="Enter Co-PI"
                style={inputStyle}
              />
            </div>
          </div>

          {/* FUNDING AGENCY + AMOUNT */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Funding Agency Name *
              </label>

              <input
                type="text"
                name="fundingAgencyName"
                value={formData.fundingAgencyName}
                onChange={handleChange}
                placeholder="Enter funding agency"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Total Sanctioned Amount *
              </label>

              <input
                type="number"
                name="amountTotalSanctioned"
                value={formData.amountTotalSanctioned}
                onChange={handleChange}
                min="0"
                placeholder="Enter amount"
                style={inputStyle}
              />
            </div>
          </div>

          {/* DURATION + ACADEMIC YEAR */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Duration *
              </label>

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                placeholder="Enter duration"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Academic Year *
              </label>

              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Academic Year
                </option>

                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DATES */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>
                From Date *
              </label>

              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                To Date *
              </label>

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* OUTCOME + STATUS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Outcome
              </label>

              <select
                name="outcomeOfProject"
                value={formData.outcomeOfProject}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Outcome
                </option>

                {OUTCOME_OPTIONS.map((outcome) => (
                  <option
                    key={outcome}
                    value={outcome}
                  >
                    {outcome}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Status of the Project *
              </label>

              <select
                name="statusOfTheProject"
                value={formData.statusOfTheProject}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Status
                </option>

                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PUBLICATION DETAILS */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Published Paper Details
            </label>

            <textarea
              name="publishedPaperDetails"
              value={formData.publishedPaperDetails}
              onChange={handleChange}
              placeholder="Enter published paper details"
              rows="3"
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          {/* JOINT PUBLICATION PROOF */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Joint Publication Proof *
            </label>

            <input
              type="text"
              name="jointPublicationProof"
              value={formData.jointPublicationProof}
              onChange={handleChange}
              placeholder="Enter joint publication proof"
              style={inputStyle}
            />
          </div>

          {/* BUTTONS */}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={buttonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...buttonStyle,
                backgroundColor: "#059669",
                border: "1px solid #059669",
                color: "#fff",
              }}
            >
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExtProject;