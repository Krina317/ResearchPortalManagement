import React from "react";

const thClass =
  "whitespace-nowrap border-b border-gray-200 px-3.5 py-[13px] text-xs font-bold text-gray-600";
const sortableThClass = `${thClass} cursor-pointer select-none hover:bg-gray-100`;
const tdClass = "px-3.5 py-[13px] align-top text-sm text-gray-700";

// extra classes for each column type
const TYPE_CLASSES = {
  title: "max-w-[320px] font-semibold text-gray-900",
  bold: "font-semibold",
  multiline: "max-w-[300px] whitespace-pre-wrap",
};

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return value;
};

const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return "—";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

const formatDuration = (duration) => {
  if (duration === null || duration === undefined || duration === "") {
    return "—";
  }

  return `${duration} ${Number(duration) === 1 ? "Year" : "Years"}`;
};

const renderCell = (project, column) => {
  const value = project[column.key];

  switch (column.type) {
    case "amount":
      return formatAmount(value);

    case "date":
      return formatDate(value);

    case "duration":
      return formatDuration(value);

    case "link":
      return value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-600 no-underline hover:underline"
        >
          View Proof
        </a>
      ) : (
        "—"
      );

    default:
      return getValue(value);
  }
};

function ProjectTable({
  columns,
  projects = [],
  sortBy = "id",
  direction = "asc",
  tableMinWidth = "min-w-[1800px]",
  onSort,
  onEdit,
  onDelete,
}) {
  const getSortSymbol = (field) => {
    if (sortBy !== field) {
      return "↕";
    }

    return direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table
          className={`w-full ${tableMinWidth} border-collapse text-left`}
        >
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) =>
                column.sortKey ? (
                  <th
                    key={column.key}
                    className={sortableThClass}
                    onClick={() => onSort(column.sortKey)}
                  >
                    {column.header} {getSortSymbol(column.sortKey)}
                  </th>
                ) : (
                  <th key={column.key} className={thClass}>
                    {column.header}
                  </th>
                )
              )}

              <th className={thClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-10 text-center text-gray-500"
                >
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr
                  key={project.id ?? index}
                  className="border-t border-gray-100"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${tdClass} ${
                        TYPE_CLASSES[column.type] || ""
                      } ${column.className || ""}`}
                    >
                      {renderCell(project, column)}
                    </td>
                  ))}

                  <td className={`${tdClass} whitespace-nowrap`}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(project)}
                        className="cursor-pointer rounded-md border border-blue-600 bg-white px-3 py-[7px] text-[13px] font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(project)}
                        className="cursor-pointer rounded-md border border-red-600 bg-white px-3 py-[7px] text-[13px] font-semibold text-red-600 hover:bg-red-50"
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

export default ProjectTable;