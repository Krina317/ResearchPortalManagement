import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ---------------------------------------------------------
// SHARED HELPERS
// ---------------------------------------------------------

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parts = String(date).split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

// ---------------------------------------------------------
// CSV + EXCEL (numbers stay numbers so Excel can sum them)
// ---------------------------------------------------------

const getExportValue = (project, column) => {
  const value = project[column.key];

  if (value === null || value === undefined || value === "") {
    return "";
  }

  switch (column.type) {
    case "amount":
    case "duration":
      return Number(value);

    case "date":
      return formatDate(value);

    default:
      return value;
  }
};

const buildExportRows = (projects, columns) =>
  projects.map((project) =>
    columns.reduce((row, column) => {
      row[column.header] = getExportValue(project, column);
      return row;
    }, {})
  );

const escapeCsvCell = (value) => {
  let text = value === null || value === undefined ? "" : String(value);

  // stop Excel from running text that starts like a formula
  if (typeof value === "string" && /^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (rows, headers, fileName) => {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvCell(row[header])).join(",")
    ),
  ];

  // BOM so Excel reads non-English names correctly
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  triggerDownload(blob, `${fileName}.csv`);
};

const EXCEL_FORMATS = {
  xlsx: { extension: "xlsx", bookType: "xlsx" },
  xls: { extension: "xls", bookType: "biff8" }, // Excel 97-2003
};

// .xls cannot hold more than 65,536 rows (including the header row)
const XLS_MAX_DATA_ROWS = 65535;

const downloadExcel = (rows, headers, fileName, sheetName, format) => {
  if (format === "xls" && rows.length > XLS_MAX_DATA_ROWS) {
    throw new Error(
      "The .xls format supports at most 65,535 rows. Please use .xlsx or CSV instead."
    );
  }

  const sheet = XLSX.utils.json_to_sheet(rows, { header: headers });

  sheet["!cols"] = headers.map((header) => {
    const longest = rows.reduce(
      (max, row) => Math.max(max, String(row[header] ?? "").length),
      header.length
    );

    return { wch: Math.min(60, longest + 2) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName.slice(0, 31));

  const { extension, bookType } = EXCEL_FORMATS[format];

  XLSX.writeFile(workbook, `${fileName}.${extension}`, { bookType });
};

// ---------------------------------------------------------
// PDF (formatted like the table on screen)
// ---------------------------------------------------------

// PDF text uses the same display format as the table. The standard PDF
// font has no ₹ symbol, so amounts are written as "Rs. 21,68,831".
const getPdfValue = (project, column) => {
  const value = project[column.key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (column.type) {
    case "amount":
      return `Rs. ${Number(value).toLocaleString("en-IN")}`;

    case "date":
      return formatDate(value);

    case "duration":
      return `${value} ${Number(value) === 1 ? "Year" : "Years"}`;

    default:
      return String(value);
  }
};

const downloadPdf = (projects, columns, fileName, title) => {
  // A3 landscape gives the wide table room to breathe
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // TITLE
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55);
  doc.text(title, 10, 14);

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `${projects.length} project${projects.length !== 1 ? "s" : ""}  |  Generated on ${new Date().toLocaleDateString("en-GB")}`,
    10,
    20
  );

  // TABLE (header row repeats on every page)
  autoTable(doc, {
    head: [columns.map((column) => column.header)],
    body: projects.map((project) =>
      columns.map((column) => getPdfValue(project, column))
    ),
    startY: 25,
    margin: { top: 12, right: 10, bottom: 14, left: 10 },
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      valign: "top",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    // short columns stay as narrow as their content, so long text gets more room
    columnStyles: columns.reduce((styles, column, index) => {
      if (
        column.key === "id" ||
        ["amount", "date", "duration"].includes(column.type)
      ) {
        styles[index] = { cellWidth: "wrap" };
      }

      return styles;
    }, {}),
  });

  // PAGE NUMBERS ("Page 1 of 3")
  const totalPages = doc.getNumberOfPages();

  doc.setFontSize(8);
  doc.setTextColor(120);

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - 10, pageHeight - 7, {
      align: "right",
    });
  }

  doc.save(`${fileName}.pdf`);
};

// ---------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------

// format: "csv" | "xlsx" | "xls" | "pdf"
export const downloadProjects = ({
  format,
  projects,
  columns,
  fileName,
  title,
}) => {
  const datedFileName = `${fileName}_${new Date().toLocaleDateString("en-CA")}`;

  if (format === "pdf") {
    downloadPdf(projects, columns, datedFileName, title);
    return;
  }

  const rows = buildExportRows(projects, columns);
  const headers = columns.map((column) => column.header);

  if (format === "csv") {
    downloadCsv(rows, headers, datedFileName);
  } else {
    downloadExcel(rows, headers, datedFileName, title, format);
  }
};