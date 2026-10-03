import { extProjectApi, nuProjectApi } from "../../api/projectApi";
import {
  ACADEMIC_YEARS,
  CALENDAR_YEARS,
  FINANCIAL_YEARS,
  NU_CATEGORIES,
  OUTCOME_OPTIONS,
  STATUS_OPTIONS,
} from "./projectConstants";

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

const validateDateOrder = (data) =>
  data.fromDate && data.toDate && data.fromDate > data.toDate
    ? "From date cannot be after to date"
    : "";

// Financial year "2024-2025" -> 1 Apr 2024 to 31 Mar 2025
// Calendar year "2024"       -> 1 Jan 2024 to 31 Dec 2024
// If both are chosen, the overlap of the two ranges is used.
const getDateRangeFromYears = (financialYear, calendarYear) => {
  const ranges = [];

  if (financialYear) {
    const startYear = Number(financialYear.slice(0, 4));
    ranges.push([`${startYear}-04-01`, `${startYear + 1}-03-31`]);
  }

  if (calendarYear) {
    ranges.push([`${calendarYear}-01-01`, `${calendarYear}-12-31`]);
  }

  if (ranges.length === 0) {
    return { dateFrom: "", dateTo: "" };
  }

  return {
    dateFrom: ranges.map((range) => range[0]).sort().pop(),
    dateTo: ranges.map((range) => range[1]).sort()[0],
  };
};

// ---------------------------------------------------------
// NU FUNDED PROJECTS
// ---------------------------------------------------------

export const nuProjectConfig = {
  title: "NU Funded Projects",
  entityName: "NU Funded Project",
  api: nuProjectApi,
  summaryPath: "/projects/nu/summary",
  tableMinWidth: "min-w-[1850px]",

  defaultFilters: {
    piSearch: "",
    coPiSearch: "",
    academicYear: "",
    projectCategory: "",
    outcome: "",
    minAmount: "",
    maxAmount: "",
    minDuration: "",
    maxDuration: "",
  },

  filterFields: [
    { name: "piSearch", label: "Principal Investigator", type: "text", placeholder: "Search PI" },
    { name: "coPiSearch", label: "Co-Principal Investigator", type: "text", placeholder: "Search Co-PI" },
    { name: "academicYear", label: "Academic Year", type: "select", options: ACADEMIC_YEARS, allLabel: "All Academic Years" },
    { name: "projectCategory", label: "Project Category", type: "select", options: NU_CATEGORIES, allLabel: "All Categories" },
    { name: "outcome", label: "Outcome", type: "select", options: OUTCOME_OPTIONS, allLabel: "All Outcomes" },
    { name: "minAmount", label: "Minimum Amount", type: "number", placeholder: "Min amount" },
    { name: "maxAmount", label: "Maximum Amount", type: "number", placeholder: "Max amount" },
    { name: "minDuration", label: "Minimum Duration", type: "number", placeholder: "Min years" },
    { name: "maxDuration", label: "Maximum Duration", type: "number", placeholder: "Max years" },
  ],

  // filter state -> query params understood by /api/nu-funded-projects/filter
  toQueryParams: (filters) => ({
    pi: filters.piSearch,
    coPi: filters.coPiSearch,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    projectCategory: filters.projectCategory,
    minDuration: filters.minDuration,
    maxDuration: filters.maxDuration,
    academicYear: filters.academicYear,
    outcome: filters.outcome,
  }),

  // type: text | title | bold | multiline | amount | date | duration | link
  // sortKey: makes the column header clickable (must be a field the backend allows)
  columns: [
    { key: "id", header: "Sr. No." },
    { key: "principalInvestigator", header: "PI" },
    { key: "coPrincipalInvestigatorList", header: "Co-PI" },
    { key: "projectTitle", header: "Project Title", type: "title" },
    { key: "amount", header: "Amount", type: "amount", sortKey: "amount" },
    { key: "nuProjectCategory", header: "NU-Minor / NU-Major" },
    { key: "academicYear", header: "Academic Year", type: "bold" },
    { key: "fromDate", header: "From Date", type: "date" },
    { key: "toDate", header: "To Date", type: "date" },
    { key: "duration", header: "Duration in Year", type: "duration" },
    { key: "outcomeOfProject", header: "Outcome of the Project", className: "max-w-[300px]" },
    { key: "publishedPaperDetails", header: "Publication Details", type: "multiline" },
    { key: "jointPublicationProof", header: "Joint Publication Proof", type: "link" },
    { key: "ugStudentDetailList", header: "UG Student Details", type: "multiline" },
  ],

  formFields: [
    { name: "projectTitle", label: "Project Title", type: "text", required: true, fullWidth: true, placeholder: "Enter project title" },
    { name: "principalInvestigator", label: "Principal Investigator", type: "text", required: true, placeholder: "Enter PI name" },
    { name: "coPrincipalInvestigatorList", label: "Co-Principal Investigator(s)", type: "text", required: true, placeholder: "Enter Co-PI names" },
    { name: "amount", label: "Amount", type: "number", required: true, min: 0, placeholder: "Enter amount" },
    { name: "nuProjectCategory", label: "Project Category", type: "select", required: true, options: NU_CATEGORIES, placeholder: "Select Category" },
    { name: "duration", label: "Duration (Years)", type: "number", required: true, min: 1, placeholder: "Enter duration" },
    { name: "academicYear", label: "Academic Year", type: "select", required: true, options: ACADEMIC_YEARS, placeholder: "Select Academic Year" },
    { name: "fromDate", label: "From Date", type: "date", required: true },
    { name: "toDate", label: "To Date", type: "date", required: true },
    { name: "outcomeOfProject", label: "Outcome of the Project", type: "select", required: true, options: OUTCOME_OPTIONS, placeholder: "Select Outcome" },
    { name: "publishedPaperDetails", label: "Published Paper Details", type: "textarea", required: true, rows: 4, fullWidth: true, placeholder: "Enter published paper details" },
    { name: "jointPublicationProof", label: "Joint Publication Proof", type: "text", required: true, fullWidth: true, placeholder: "Enter proof link/reference" },
    { name: "ugStudentDetailList", label: "UG Student Details", type: "textarea", required: true, rows: 3, fullWidth: true, placeholder: "Enter UG student details" },
  ],

  validate: validateDateOrder,
};

// ---------------------------------------------------------
// EXTERNAL FUNDED PROJECTS
// ---------------------------------------------------------

export const extProjectConfig = {
  title: "External Funded Projects",
  entityName: "External Funded Project",
  api: extProjectApi,
  summaryPath: "/projects/external/summary",
  tableMinWidth: "min-w-[1900px]",

  defaultFilters: {
    projectTitle: "",
    piSearch: "",
    coPiSearch: "",
    fundingAgencyName: "",
    academicYear: "",
    financialYear: "",
    calendarYear: "",
    status: "",
    outcome: "",
    minAmount: "",
    maxAmount: "",
    minDuration: "",
    maxDuration: "",
  },

  filterFields: [
    { name: "projectTitle", label: "Project Title", type: "text", placeholder: "Search project title" },
    { name: "piSearch", label: "Principal Investigator", type: "text", placeholder: "Search PI" },
    { name: "coPiSearch", label: "Co-Principal Investigator", type: "text", placeholder: "Search Co-PI" },
    { name: "fundingAgencyName", label: "Funding Agency", type: "text", placeholder: "Search funding agency" },
    { name: "academicYear", label: "Academic Year", type: "select", options: ACADEMIC_YEARS, allLabel: "All Academic Years" },
    { name: "financialYear", label: "Financial Year", type: "select", options: FINANCIAL_YEARS, allLabel: "All Financial Years" },
    { name: "calendarYear", label: "Calendar Year", type: "select", options: CALENDAR_YEARS, allLabel: "All Calendar Years" },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, allLabel: "All Statuses" },
    { name: "outcome", label: "Outcome", type: "select", options: OUTCOME_OPTIONS, allLabel: "All Outcomes" },
    { name: "minAmount", label: "Minimum Sanctioned Amount", type: "number", placeholder: "Minimum amount" },
    { name: "maxAmount", label: "Maximum Sanctioned Amount", type: "number", placeholder: "Maximum amount" },
    { name: "minDuration", label: "Minimum Duration", type: "number", placeholder: "Minimum duration" },
    { name: "maxDuration", label: "Maximum Duration", type: "number", placeholder: "Maximum duration" },
  ],

  // filter state -> query params understood by /api/external-funded-projects/filter
  toQueryParams: (filters) => {
    const { dateFrom, dateTo } = getDateRangeFromYears(
      filters.financialYear,
      filters.calendarYear
    );

    return {
      projectTitle: filters.projectTitle,
      pi: filters.piSearch,
      coPi: filters.coPiSearch,
      fundingAgencyName: filters.fundingAgencyName,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      minDuration: filters.minDuration,
      maxDuration: filters.maxDuration,
      academicYear: filters.academicYear,
      outcome: filters.outcome,
      status: filters.status,
      dateFrom,
      dateTo,
    };
  },

  columns: [
    { key: "id", header: "Sr. No." },
    { key: "principalInvestigator", header: "PI" },
    { key: "coPrincipalInvestigatorList", header: "Co-PI" },
    { key: "projectTitle", header: "Project Title", type: "title" },
    { key: "fundingAgencyName", header: "Funding Agency", className: "max-w-[250px]" },
    { key: "amount", header: "Total Sanctioned Amount", type: "amount", sortKey: "amount" },
    { key: "academicYear", header: "Academic Year", type: "bold" },
    { key: "fromDate", header: "From Date", type: "date", sortKey: "fromDate" },
    { key: "toDate", header: "To Date", type: "date", sortKey: "toDate" },
    { key: "duration", header: "Duration in Year", type: "duration" },
    { key: "outcomeOfProject", header: "Outcome of the Project", className: "max-w-[300px]" },
    { key: "publishedPaperDetails", header: "Publication Details", type: "multiline" },
    { key: "jointPublicationProof", header: "Joint Publication Proof", type: "link" },
    { key: "statusOfTheProject", header: "Status" },
  ],

  formFields: [
    { name: "projectTitle", label: "Project Title", type: "text", required: true, fullWidth: true, placeholder: "Enter project title" },
    { name: "principalInvestigator", label: "Principal Investigator", type: "text", required: true, placeholder: "Enter PI" },
    { name: "coPrincipalInvestigatorList", label: "Co-Principal Investigator", type: "text", required: true, placeholder: "Enter Co-PI" },
    { name: "fundingAgencyName", label: "Funding Agency Name", type: "text", required: true, placeholder: "Enter funding agency" },
    { name: "amount", label: "Total Sanctioned Amount", type: "number", required: true, min: 0, placeholder: "Enter amount" },
    { name: "duration", label: "Duration", type: "number", required: true, min: 0, placeholder: "Enter duration" },
    { name: "academicYear", label: "Academic Year", type: "select", required: true, options: ACADEMIC_YEARS, placeholder: "Select Academic Year" },
    { name: "fromDate", label: "From Date", type: "date", required: true },
    { name: "toDate", label: "To Date", type: "date", required: true },
    { name: "outcomeOfProject", label: "Outcome", type: "select", required: true, options: OUTCOME_OPTIONS, placeholder: "Select Outcome" },
    { name: "statusOfTheProject", label: "Status of the Project", type: "select", required: true, options: STATUS_OPTIONS, placeholder: "Select Status" },
    { name: "publishedPaperDetails", label: "Published Paper Details", type: "textarea", required: true, rows: 3, fullWidth: true, placeholder: "Enter published paper details" },
    { name: "jointPublicationProof", label: "Joint Publication Proof", type: "text", required: true, fullWidth: true, placeholder: "Enter joint publication proof" },
  ],

  validate: validateDateOrder,
};