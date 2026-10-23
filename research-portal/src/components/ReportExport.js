// npm install jspdf@2.5.2 jspdf-autotable@3.8.4
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const INSTITUTE = [
  "Nirma University",
  "Institute of Technology",
  "Department of Computer Science and Engineering",
];

const FILE_NAME = "External_Funded_Projects_Report";

// ------------------------------------------------------------------ PDF
export const downloadPdf = (groups, currentYear, fileName = FILE_NAME) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  groups.forEach((group, gi) => {
    if (gi > 0) doc.addPage();

    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(INSTITUTE[0], pageW / 2, y, { align: "center" });
    doc.setFontSize(11);
    doc.text(INSTITUTE[1], pageW / 2, (y += 16), { align: "center" });
    doc.text(INSTITUTE[2], pageW / 2, (y += 16), { align: "center" });
    doc.setFontSize(10);
    doc.text(group.heading, 30, (y += 28), { maxWidth: pageW - 60 });
    y += 16;

    if (group.tables.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.text("No projects.", 30, y + 10);
    }

    group.tables.forEach((t) => {
      const cols = t.head.length;
      if (y > pageH - 120) {
        doc.addPage();
        y = 40;
      }

      const head = [];
      if (t.caption) {
        head.push([{ content: t.caption, colSpan: cols, styles: { halign: "left" } }]);
      }
      head.push(t.head);

      const foot = t.summary.map((s) => [
        { content: s.label, colSpan: cols - 1, styles: { halign: "right" } },
        s.value,
      ]);

      autoTable(doc, {
        startY: y,
        head,
        body: t.rows,
        foot,
        showFoot: "lastPage",
        theme: "grid",
        margin: { left: 30, right: 30 },
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak", textColor: 20 },
        headStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" },
        footStyles: { fillColor: [245, 245, 245], textColor: 20, fontStyle: "bold" },
      });
      y = doc.lastAutoTable.finalY + 18;
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lastY = Math.min(y + 20, pageH - 30);
    doc.text("Prepared By:", 30, lastY);
    doc.text("Verified By:", pageW - 200, lastY);
  });

  doc.save(`${fileName}_${currentYear}.pdf`);
};

// ----------------------------------------------------------------- Word
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const tableHtml = (t) => {
  const cols = t.head.length;
  const th = (c) => `<th style="border:1px solid #000;padding:4px;background:#e6e6e6">${esc(c)}</th>`;
  const td = (c) => `<td style="border:1px solid #000;padding:4px;vertical-align:top">${esc(c)}</td>`;

  const caption = t.caption
    ? `<tr><th colspan="${cols}" style="border:1px solid #000;padding:4px;text-align:left;background:#e6e6e6">${esc(t.caption)}</th></tr>`
    : "";
  const head = `<tr>${t.head.map(th).join("")}</tr>`;
  const body = t.rows.map((r) => `<tr>${r.map(td).join("")}</tr>`).join("");
  const foot = t.summary
    .map(
      (s) =>
        `<tr><td colspan="${cols - 1}" style="border:1px solid #000;padding:4px;text-align:right"><b>${esc(s.label)}</b></td>` +
        `<td style="border:1px solid #000;padding:4px"><b>${esc(s.value)}</b></td></tr>`
    )
    .join("");

  return `<table style="border-collapse:collapse;width:100%;font-size:10pt;margin-bottom:14pt">${caption}${head}${body}${foot}</table>`;
};

export const downloadWord = (groups, currentYear, fileName = FILE_NAME) => {
  const sections = groups
    .map((g, i) => {
      const tables = g.tables.length ? g.tables.map(tableHtml).join("") : "<p>No projects.</p>";
      return `
        ${i > 0 ? '<br clear="all" style="page-break-before:always" />' : ""}
        <p align="center" style="margin:0"><b style="font-size:14pt">${INSTITUTE[0]}</b></p>
        <p align="center" style="margin:0"><b>${INSTITUTE[1]}</b></p>
        <p align="center" style="margin:0 0 12pt 0"><b>${INSTITUTE[2]}</b></p>
        <p><b>${esc(g.heading)}</b></p>
        ${tables}
        <p>Prepared By:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Verified By:</p>`;
    })
    .join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>External Funded Projects Report</title>
    <style>
      @page Section1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 36pt; }
      div.Section1 { page: Section1; }
      body { font-family: "Times New Roman", serif; font-size: 11pt; }
    </style></head>
    <body><div class="Section1">${sections}</div></body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}_${currentYear}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};