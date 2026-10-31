import { inr } from "./ExternalReportModel";

const pad = (n) => String(n).padStart(2, "0");
const yearHead = (y) => (y.label ? `${y.academicYear} (${y.label})` : y.academicYear);

export const buildNuReportGroups = (r) => {
  const tableA = {
    head: ["", ...r.summary.years.map(yearHead)],
    rows: [
      ["No. of projects (Sanctioned)", ...r.summary.years.map((y) => pad(y.projectCount))],
      ["Amount (in Rs.)", ...r.summary.years.map((y) => inr(y.amount))],
    ],
    summary: [
      { label: "Total amount for past 3 years (CAYm1 + CAYm2 + CAYm3, CAY not included)", value: inr(r.summary.totalCaym1ToCaym3) },
    ],
  };

  const b = r.bifurcation;
  const table511 = {
    head: ["Assessment Year", "Sanctioned Amount (in Rs.)", "External Projects", "NU funded Projects"],
    rows: [
      ...b.years.map((y) => [yearHead(y), inr(y.totalAmount), inr(y.externalAmount), inr(y.nuAmount)]),
      ["Total (CAYm1 + CAYm2 + CAYm3, CAY not included)", inr(b.totalAmountCaym1ToCaym3), inr(b.externalAmountCaym1ToCaym3), inr(b.nuAmountCaym1ToCaym3)],
    ],
    summary: [],
  };

  const detailTables = r.details.map((y) => ({
    caption: `Academic Year ${yearHead(y)}`,
    head: [
      "Sr. No.",
      "Project Title",
      "Name of Principal Investigator(s)",
      "Funding Agency name",
      "Amount (Total Sanctioned Funding in Rs.)",
      "Duration (in years)",
    ],
    rows: y.projects.map((p) => [String(p.srNo), p.projectTitle, p.investigators, p.category, inr(p.amount), p.duration]),
    summary: [],
  }));

  return [
    { id: "a", sheet: "Table A", heading: "Table A: Summary of NU Funded Research Projects", tables: [tableA] },
    { id: "b", sheet: "Table 5.11", heading: "Table 5.11: Bifurcation of external and NU funded projects", tables: [table511] },
    { id: "c", sheet: "Table 5.12", heading: "Table 5.12: Funded major research projects (NU Funded)", tables: detailTables },
  ];
};