import React, { useState } from "react";

const initialForm = {
  projectTitle: "",
  principalInvestigator: "",
  coPrincipalInvestigatorList: "",
  amount: "",
  projectCategory: "",
  duration: "",

  outcomeOfResearchProject: "",

  paperTitle: "",
  publicationType: "",
  publicationStatus: "",
  doiLink: "",
  jointPublication: "",

  jointPublicationProof: "",

  ugStudentDetailList: "",
};

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  rows,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>

      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          style={styles.textarea}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AddProject({
  onSave,
  onClose,
  initialValues = {},
}) {
  const [form, setForm] = useState({
    ...initialForm,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    }

    if (!form.principalInvestigator.trim()) {
      newErrors.principalInvestigator =
        "Principal investigator is required";
    }

    if (!form.coPrincipalInvestigatorList.trim()) {
      newErrors.coPrincipalInvestigatorList =
        "Co-principal investigator list is required";
    }

    if (
      form.amount === "" ||
      form.amount === null ||
      Number(form.amount) < 0
    ) {
      newErrors.amount = "Valid amount is required";
    }

    if (!form.projectCategory) {
      newErrors.projectCategory = "Project category is required";
    }

    if (
      form.duration === "" ||
      form.duration === null ||
      Number(form.duration) < 0
    ) {
      newErrors.duration = "Valid duration is required";
    }

    if (!form.jointPublicationProof.trim()) {
      newErrors.jointPublicationProof =
        "Joint publication proof is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildPublishedPaperDetails = () => {
    /*
      Backend has ONE field:

      publishedPaperDetails

      The UI has separate fields for easier entry.
      We combine them before passing the data upward.
    */

    const hasPublicationDetails =
      form.paperTitle.trim() ||
      form.publicationType ||
      form.publicationStatus ||
      form.doiLink.trim() ||
      form.jointPublication;

    if (!hasPublicationDetails) {
      return "";
    }

    return [
      `Title: ${form.paperTitle.trim()}`,
      `Publication Type: ${form.publicationType}`,
      `Publication Status: ${form.publicationStatus}`,
      `DOI Link: ${form.doiLink.trim()}`,
      `Joint Publication Yes/No: ${form.jointPublication}`,
    ].join("\n");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const requestData = {
      projectTitle: form.projectTitle.trim(),

      principalInvestigator:
        form.principalInvestigator.trim(),

      coPrincipalInvestigatorList:
        form.coPrincipalInvestigatorList.trim(),

      amount: Number(form.amount),

      projectCategory: form.projectCategory,

      duration: Number(form.duration),

      outcomeOfResearchProject:
        form.outcomeOfResearchProject.trim() || null,

      publishedPaperDetails:
        buildPublishedPaperDetails() || null,

      jointPublicationProof:
        form.jointPublicationProof.trim(),

      ugStudentDetailList:
        form.ugStudentDetailList.trim() || null,
    };

    /*
      No Axios here.

      Parent component receives the final request object
      and can call projectApi.js.
    */
    if (onSave) {
      onSave(requestData);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Add NU Funded Project</h2>
            <p style={styles.subtitle}>
              Enter the project details below
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={styles.closeButton}
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* --------------------------------------------- */}
          {/* PROJECT INFORMATION */}
          {/* --------------------------------------------- */}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Project Information
            </h3>

            <div style={styles.grid}>
              <div style={styles.fullWidth}>
                <Field
                  label="Project Title"
                  name="projectTitle"
                  value={form.projectTitle}
                  onChange={handleChange}
                  required
                  placeholder="Enter project title"
                />

                {errors.projectTitle && (
                  <p style={styles.error}>
                    {errors.projectTitle}
                  </p>
                )}
              </div>

              <div>
                <Field
                  label="Principal Investigator"
                  name="principalInvestigator"
                  value={form.principalInvestigator}
                  onChange={handleChange}
                  required
                  placeholder="Enter PI name"
                />

                {errors.principalInvestigator && (
                  <p style={styles.error}>
                    {errors.principalInvestigator}
                  </p>
                )}
              </div>

              <div>
                <Field
                  label="Co-Principal Investigator"
                  name="coPrincipalInvestigatorList"
                  value={form.coPrincipalInvestigatorList}
                  onChange={handleChange}
                  required
                  placeholder="Enter Co-PI name(s)"
                />

                {errors.coPrincipalInvestigatorList && (
                  <p style={styles.error}>
                    {errors.coPrincipalInvestigatorList}
                  </p>
                )}
              </div>

              <div>
                <Field
                  label="Amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="Enter amount"
                />

                {errors.amount && (
                  <p style={styles.error}>{errors.amount}</p>
                )}
              </div>

              <div>
                <SelectField
                  label="Project Category"
                  name="projectCategory"
                  value={form.projectCategory}
                  onChange={handleChange}
                  required
                  options={[
                    {
                      value: "NU-Minor",
                      label: "NU-Minor",
                    },
                    {
                      value: "NU-Major",
                      label: "NU-Major",
                    },
                  ]}
                />

                {errors.projectCategory && (
                  <p style={styles.error}>
                    {errors.projectCategory}
                  </p>
                )}
              </div>

              <div>
                <Field
                  label="Duration in Years"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="Enter duration"
                />

                {errors.duration && (
                  <p style={styles.error}>
                    {errors.duration}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --------------------------------------------- */}
          {/* OUTCOME */}
          {/* --------------------------------------------- */}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Outcome of the Project
            </h3>

            <Field
              label="Outcome of the Project"
              name="outcomeOfResearchProject"
              value={form.outcomeOfResearchProject}
              onChange={handleChange}
              placeholder="Enter the outcome of the research project"
              rows={4}
            />
          </div>

          {/* --------------------------------------------- */}
          {/* PUBLICATION DETAILS */}
          {/* --------------------------------------------- */}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Publication Details
            </h3>

            <p style={styles.sectionDescription}>
              Optional — fill these fields if a paper has been
              published based on the research project.
            </p>

            <div style={styles.grid}>
              <div style={styles.fullWidth}>
                <Field
                  label="Title"
                  name="paperTitle"
                  value={form.paperTitle}
                  onChange={handleChange}
                  placeholder="Enter paper title"
                />
              </div>

              <div>
                <SelectField
                  label="Publication Type"
                  name="publicationType"
                  value={form.publicationType}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Journal",
                      label: "Journal",
                    },
                    {
                      value: "Conference",
                      label: "Conference",
                    },
                  ]}
                />
              </div>

              <div>
                <SelectField
                  label="Publication Status"
                  name="publicationStatus"
                  value={form.publicationStatus}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Published",
                      label: "Published",
                    },
                    {
                      value: "Accepted",
                      label: "Accepted",
                    },
                    {
                      value: "Under Review",
                      label: "Under Review",
                    },
                    {
                      value: "Submitted",
                      label: "Submitted",
                    },
                  ]}
                />
              </div>

              <div>
                <Field
                  label="DOI Link"
                  name="doiLink"
                  value={form.doiLink}
                  onChange={handleChange}
                  placeholder="https://doi.org/..."
                />
              </div>

              <div>
                <SelectField
                  label="Joint Publication"
                  name="jointPublication"
                  value={form.jointPublication}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------- */}
          {/* JOINT PUBLICATION PROOF */}
          {/* --------------------------------------------- */}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Joint Publication Proof
            </h3>

            <p style={styles.sectionDescription}>
              Enter the link to the folder containing the joint
              publication proof.
            </p>

            <Field
              label="Joint Publication Proof"
              name="jointPublicationProof"
              value={form.jointPublicationProof}
              onChange={handleChange}
              required
              placeholder="Enter proof folder link"
            />

            {errors.jointPublicationProof && (
              <p style={styles.error}>
                {errors.jointPublicationProof}
              </p>
            )}

            <p style={styles.helperText}>
              Folder name: CSE_JOINT PUBLICATIONS_PROOFS
            </p>
          </div>

          {/* --------------------------------------------- */}
          {/* UG STUDENTS */}
          {/* --------------------------------------------- */}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              UG Student Involved in Project
            </h3>

            <p style={styles.sectionDescription}>
              Optional — enter Roll No, Name and Student Role.
            </p>

            <Field
              label="UG Student Details"
              name="ugStudentDetailList"
              value={form.ugStudentDetailList}
              onChange={handleChange}
              placeholder="Example: 22BCE001, Rahul Shah, Research Assistant"
              rows={4}
            />
          </div>

          {/* --------------------------------------------- */}
          {/* ACTIONS */}
          {/* --------------------------------------------- */}

          <div style={styles.actions}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              style={styles.saveButton}
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },

  modal: {
    width: "100%",
    maxWidth: "900px",
    maxHeight: "92vh",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "28px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    color: "#6b7280",
    lineHeight: 1,
  },

  section: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
    fontWeight: 650,
  },

  sectionDescription: {
    margin: "0 0 18px",
    color: "#6b7280",
    fontSize: "13px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  fullWidth: {
    gridColumn: "1 / -1",
  },

  field: {
    width: "100%",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },

  required: {
    color: "#dc2626",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
  },

  error: {
    margin: "5px 0 0",
    color: "#dc2626",
    fontSize: "12px",
  },

  helperText: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: "12px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px",
  },

  cancelButton: {
    padding: "10px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  saveButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
};