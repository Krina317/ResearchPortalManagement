// Turns the backend DTO into a plain "table model" that the screen,
// the PDF export and the Word export all share.
//
// table = { caption?: string, head: string[], rows: string[][], summary: {label, value}[] }
// group = { id, heading, tables: table[] }

export const inr = (n) =>
    n === null || n === undefined ? "-" : `${Number(n).toLocaleString("en-IN")}/-`;
  
  const pad = (n) => String(n).padStart(2, "0");
  const yearHead = (y) => (y.label ? `${y.academicYear} (${y.label})` : y.academicYear);
  
  export const buildReportGroups = (r) => {
    const s1 = r.sanctionedSummary;
    const s2 = r.detailedSummary;
  
    const tableOne = {
      head: ["", ...s1.years.map(yearHead)],
      rows: [
        ["No. of projects (Sanctioned)", ...s1.years.map((y) => pad(y.projectCount))],
        ["Amount (in Rs.)", ...s1.years.map((y) => inr(y.amount))],
      ],
      summary: [
        { label: "Total amount (in Rs.) for CAYm1 + CAYm2 + CAYm3", value: inr(s1.totalCaym1ToCaym3) },
        { label: "Total amount (in Rs.) for CAY + CAYm1 + CAYm2 + CAYm3", value: inr(s1.totalCayToCaym3) },
      ],
    };
  
    const tableTwo = {
      head: [
        "Assessment year",
        "Total no. of projects",
        "No. of sanctioned projects",
        "No. of ongoing projects",
        "No. of completed projects",
        "Sanctioned amount (in Rs.)",
      ],
      rows: s2.years.map((y) => [
        yearHead(y),
        pad(y.totalProjects),
        pad(y.sanctioned),
        pad(y.ongoing),
        pad(y.completed),
        inr(y.sanctionedAmount),
      ]),
      summary: [
        { label: "Total amount for past 3 years i.e. (CAYm1 + CAYm2 + CAYm3)", value: inr(s2.totalCaym1ToCaym3) },
        { label: "Total amount for CAY + CAYm1 + CAYm2 + CAYm3", value: inr(s2.totalCayToCaym3) },
      ],
    };
  
    const tableThree = r.sanctionedDetails.map((y) => ({
      caption: `Academic Year ${yearHead(y)}`,
      head: [
        "Sr. No.",
        "Project Title",
        "Name of Principal Investigator(s)",
        "Funding Agency name",
        "Amount (Total Sanctioned Funding in Rs.)",
        "Duration (in years)",
      ],
      rows: y.projects.map((p) => [
        String(p.srNo),
        p.projectTitle,
        p.investigators,
        p.fundingAgency,
        inr(p.amount),
        p.duration,
      ]),
      summary: [],
    }));
  
    const tableFour = r.yearWiseDetails.map((y) => ({
      caption: `Academic Year ${yearHead(y)}`,
      head: [
        "Sr. No.",
        "Project Title",
        "Name of Principal Investigator(s)",
        "Funding Agency",
        "Total Sanctioned Funding (in Rs.)",
        "Fund Received (in Rs.)",
        "Duration (in years)",
        "Status (Sanctioned / Ongoing / Completed)",
        "Remarks",
      ],
      rows: y.projects.map((p) => [
        String(p.srNo),
        p.projectTitle,
        p.investigators,
        p.fundingAgency,
        inr(p.amount),
        p.fundReceived || "-",
        p.duration,
        p.status,
        p.remarks || "",
      ]),
      summary: [],
    }));
  
    return [
      { id: "t1", heading: "Table I: Summary of Sanctioned External Funded Research Projects", tables: [tableOne] },
      {
        id: "t2",
        heading: "Table II: Detailed Summary of External Funded Research Projects with bifurcation of Sanctioned / Ongoing / Completed",
        tables: [tableTwo],
      },
      { id: "t3", heading: "External Funded research projects details (Sanctioned)", tables: tableThree },
      {
        id: "t4",
        heading: "External Funded research projects details (Sanctioned / Ongoing / Completed)",
        tables: tableFour,
      },
    ];
  };