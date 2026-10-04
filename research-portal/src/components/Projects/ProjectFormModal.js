import React, { useEffect, useState } from "react";

const inputClass =
  "w-full box-border rounded-[7px] border border-gray-300 bg-white px-2.5 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600";
const labelClass = "mb-[5px] block text-xs font-semibold text-gray-600";
const cancelButtonClass =
  "cursor-pointer rounded-[7px] border border-gray-300 bg-white px-4 py-[9px] text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60";
const submitButtonClass =
  "cursor-pointer rounded-[7px] border border-emerald-600 bg-emerald-600 px-4 py-[9px] text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";

const buildInitialValues = (fields, project) =>
  fields.reduce((values, field) => {
    values[field.name] = project?.[field.name] ?? "";
    return values;
  }, {});

function ProjectFormModal({
  entityName,
  fields,
  validate,
  projectToEdit,
  onSave,
  onClose,
}) {
  const isEditMode = Boolean(projectToEdit);

  const [formData, setFormData] = useState(() =>
    buildInitialValues(fields, projectToEdit)
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(buildInitialValues(fields, projectToEdit));
    setError("");
  }, [fields, projectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const validateForm = () => {
    for (const field of fields) {
      const raw = formData[field.name];
      const value = typeof raw === "string" ? raw.trim() : raw;

      if (field.required && (value === "" || value === null || value === undefined)) {
        return `${field.label} is required`;
      }

      if (
        field.type === "number" &&
        value !== "" &&
        field.min !== undefined &&
        Number(value) < field.min
      ) {
        return `${field.label} cannot be less than ${field.min}`;
      }
    }

    return validate ? validate(formData) : "";
  };

  const buildRequestData = () =>
    fields.reduce((data, field) => {
      const value = formData[field.name];

      if (field.type === "number") {
        data[field.name] = value === "" ? null : Number(value);
      } else if (typeof value === "string") {
        data[field.name] = value.trim();
      } else {
        data[field.name] = value;
      }

      return data;
    }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(buildRequestData());
    } catch (err) {
      setError(err?.message || `Failed to save ${entityName.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (field) => {
    const common = {
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
      className: inputClass,
    };

    switch (field.type) {
      case "select":
        return (
          <select {...common}>
            <option value="">{field.placeholder || "Select"}</option>

            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...common}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className={`${inputClass} resize-y`}
          />
        );

      case "number":
        return (
          <input
            {...common}
            type="number"
            min={field.min}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <input
            {...common}
            type={field.type || "text"}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-5">
      <div className="box-border max-h-[90vh] w-full max-w-[850px] overflow-y-auto rounded-[10px] border border-gray-200 bg-white p-[22px]">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="m-0 text-[21px] font-semibold text-gray-900">
            {isEditMode ? `Edit ${entityName}` : `Add ${entityName}`}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="cursor-pointer border-none bg-transparent text-xl text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-[15px] rounded-[7px] border border-red-200 bg-red-100 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3.5">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.fullWidth ? "col-span-full" : ""}
              >
                <label className={labelClass}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>

                {renderInput(field)}
              </div>
            ))}
          </div>

          {/* BUTTONS */}
                    {/* BUTTONS */}
                    <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={cancelButtonClass}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={submitButtonClass}
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

export default ProjectFormModal;