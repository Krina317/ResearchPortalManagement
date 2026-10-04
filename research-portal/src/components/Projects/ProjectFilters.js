import React, { useState } from "react";

const inputClass =
  "w-full box-border rounded-[7px] border border-gray-300 bg-white px-2.5 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600";
const labelClass = "mb-[5px] block text-xs font-semibold text-gray-600";

function ProjectFilters({
  filters,
  groups,
  activeCount = 0,
  columns = [],
  visibleColumnKeys = [],
  onFiltersChange,
  onApply,
  onClear,
  onToggleColumn,
  onSelectAllColumns,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = (name, value) => {
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply();
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
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
      );
    }

    return (
      <input
        type={field.type}
        min={field.type === "number" ? 0 : undefined}
        value={filters[field.name]}
        onChange={(e) => updateFilter(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  };

  return (
    <div className="mb-3.5 rounded-[10px] border border-gray-200 bg-white">
      {/* HEADER: click to expand / collapse */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between rounded-[10px] border-none bg-transparent px-[18px] py-3.5 text-left hover:bg-gray-50"
      >
        <span className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {activeCount} applied
            </span>
          )}
        </span>

        <span className="text-xs font-semibold text-gray-500">
          {isOpen ? "Hide ▲" : "Show ▼"}
        </span>
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-[18px]"
        >
          {/* FILTER BOXES */}
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {groups.map((group) => (
              <section
                key={group.title}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3.5"
              >
                <h3 className="m-0 text-[13px] font-bold text-gray-800">
                  {group.title}
                </h3>

                {group.description && (
                  <p className="m-0 mt-0.5 text-xs text-gray-500">
                    {group.description}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
                  {group.fields.map((field) => (
                    <div key={field.name}>
                      <label className={labelClass}>{field.label}</label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* COLUMN SELECTOR (changes instantly, no Apply needed) */}
            {columns.length > 0 && (
              <section className="rounded-lg border border-gray-200 bg-gray-50 p-3.5 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="m-0 text-[13px] font-bold text-gray-800">
                      Columns
                    </h3>

                    <p className="m-0 mt-0.5 text-xs text-gray-500">
                      Choose which columns to show in the table and downloads (
                      {visibleColumnKeys.length} of {columns.length} selected)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onSelectAllColumns}
                    disabled={visibleColumnKeys.length === columns.length}
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                  >
                    Select All
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-3 gap-y-2">
                  {columns.map((column) => {
                    const isChecked = visibleColumnKeys.includes(column.key);
                    const isLastChecked =
                      isChecked && visibleColumnKeys.length === 1;

                    return (
                      <label
                        key={column.key}
                        title={
                          isLastChecked
                            ? "At least one column must stay selected"
                            : undefined
                        }
                        className={`flex items-center gap-2 text-sm text-gray-700 ${
                          isLastChecked
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isLastChecked}
                          onChange={() => onToggleColumn(column.key)}
                          className="h-4 w-4 accent-emerald-600"
                        />
                        {column.header}
                      </label>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ACTIONS */}
          <div className="mt-3.5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClear}
              className="cursor-pointer rounded-[7px] border border-gray-300 bg-white px-[15px] py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>

            <button
              type="submit"
              className="cursor-pointer rounded-[7px] border border-emerald-600 bg-emerald-600 px-[15px] py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProjectFilters;