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

const OUTCOME_OPTIONS = [
  "Journal Paper Published",
  "Conference Paper Published",
  "None",
  "Any activity performed based on research project",
];

function AddProject({
  onSave,
  onClose,
  projectToEdit = null,
}) {
  const isEditMode = Boolean(projectToEdit);

  const emptyForm = {
    projectTitle: "",
    principalInvestigator: "",
    coPrincipalInvestigatorList: "",
    amount: "",
    projectCategory: "",
    duration: "",
    academicYear: "",
    outcomeOfResearchProject: "",
    publishedPaperDetails: "",
    jointPublicationProof: "",
    ugStudentDetailList: "",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        projectTitle:
          projectToEdit.projectTitle ?? "",

        principalInvestigator:
          projectToEdit.principalInvestigator ?? "",

        coPrincipalInvestigatorList:
          projectToEdit.coPrincipalInvestigatorList ?? "",

        amount:
          projectToEdit.amount ?? "",

        projectCategory:
          projectToEdit.projectCategory ?? "",

        duration:
          projectToEdit.duration ?? "",

        academicYear:
          projectToEdit.academicYear ?? "",

        outcomeOfResearchProject:
          projectToEdit.outcomeOfResearchProject ?? "",

        publishedPaperDetails:
          projectToEdit.publishedPaperDetails ?? "",

        jointPublicationProof:
          projectToEdit.jointPublicationProof ?? "",

        ugStudentDetailList:
          projectToEdit.ugStudentDetailList ?? "",
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [projectToEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.projectTitle.trim() ||
      !formData.principalInvestigator.trim() ||
      !formData.coPrincipalInvestigatorList.trim() ||
      !formData.amount ||
      !formData.projectCategory ||
      !formData.duration ||
      !formData.academicYear ||
      !formData.jointPublicationProof.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const requestData = {
      projectTitle:
        formData.projectTitle.trim(),

      principalInvestigator:
        formData.principalInvestigator.trim(),

      coPrincipalInvestigatorList:
        formData.coPrincipalInvestigatorList.trim(),

      amount: Number(formData.amount),

      projectCategory:
        formData.projectCategory,

      duration: Number(formData.duration),

      academicYear:
        formData.academicYear,

      outcomeOfResearchProject:
        formData.outcomeOfResearchProject,

      publishedPaperDetails:
        formData.publishedPaperDetails,

      jointPublicationProof:
        formData.jointPublicationProof.trim(),

      ugStudentDetailList:
        formData.ugStudentDetailList,
    };

    try {
      setSaving(true);

      await onSave(requestData);

      if (!isEditMode) {
        setFormData(emptyForm);
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "12px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#1f2937",
            }}
          >
            {isEditMode
              ? "Edit NU Funded Project"
              : "Add New NU Funded Project"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>
                Project Title *
              </label>

              <input
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="Enter project title"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Principal Investigator *
              </label>

              <input
                name="principalInvestigator"
                value={
                  formData.principalInvestigator
                }
                onChange={handleChange}
                placeholder="Enter PI name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Co-Principal Investigator(s) *
              </label>

              <input
                name="coPrincipalInvestigatorList"
                value={
                  formData.coPrincipalInvestigatorList
                }
                onChange={handleChange}
                placeholder="Enter Co-PI names"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Amount *
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Project Category *
              </label>

              <select
                name="projectCategory"
                value={formData.projectCategory}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Category
                </option>

                <option value="NU-Minor">
                  NU-Minor
                </option>

                <option value="NU-Major">
                  NU-Major
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Duration (Years) *
              </label>

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                min="1"
                style={inputStyle}
              />
            </div>

            <div>
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
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Outcome of the Project
              </label>

              <select
                name="outcomeOfResearchProject"
                value={
                  formData.outcomeOfResearchProject
                }
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Outcome
                </option>

                {OUTCOME_OPTIONS.map(
                  (outcome) => (
                    <option
                      key={outcome}
                      value={outcome}
                    >
                      {outcome}
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>
                Published Paper Details
              </label>

              <textarea
                name="publishedPaperDetails"
                value={
                  formData.publishedPaperDetails
                }
                onChange={handleChange}
                placeholder="Enter published paper details"
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>
                Joint Publication Proof *
              </label>

              <input
                name="jointPublicationProof"
                value={
                  formData.jointPublicationProof
                }
                onChange={handleChange}
                placeholder="Enter proof link/reference"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>
                UG Student Details
              </label>

              <textarea
                name="ugStudentDetailList"
                value={
                  formData.ugStudentDetailList
                }
                onChange={handleChange}
                placeholder="Enter UG student details"
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "12px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "7px",
                  color: "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderTop:
                "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "7px",
                border:
                  "1px solid #d1d5db",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 18px",
                borderRadius: "7px",
                border: "none",
                backgroundColor: "#059669",
                color: "#fff",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Project"
                : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;