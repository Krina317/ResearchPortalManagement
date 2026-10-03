import React from "react";

const inputClass =
  "w-full box-border rounded-[7px] border border-gray-300 bg-white px-2.5 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600";
const labelClass = "mb-[5px] block text-xs font-semibold text-gray-600";

function ProjectFilters({ filters, fields, onFiltersChange, onClear }) {
  const updateFilter = (name, value) => {
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="mb-3.5 rounded-[10px] border border-gray-200 bg-white p-[18px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>

            {field.type === "select" ? (
              <select
                value={filters[field.name]}
                onChange={(e) => updateFilter(field.name, e.target.value)}
                className={inputClass}
              >
                <option value="">{field.allLabel || "All"}</option>

                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                min={field.type === "number" ? 0 : undefined}
                value={filters[field.name]}
                onChange={(e) => updateFilter(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer rounded-[7px] border border-gray-300 bg-white px-[15px] py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ProjectFilters;