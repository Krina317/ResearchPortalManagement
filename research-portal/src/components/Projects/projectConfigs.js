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

// Turns the date filters into one range: dateFrom / dateTo.
//   Financial year "2024-2025" -> 1 Apr 2024 to 31 Mar 2025
//   Calendar year "2024"       -> 1 Jan 2024 to 31 Dec 2024
// If several are chosen, the overlap of all of them is used
// (latest start date, earliest end date).
const getDateRange = ({ fromDate, toDate, financialYear, calendarYear }) => {
  const starts = [];
  const ends = [];

  if (fromDate) starts.push(fromDate);
  if (toDate) ends.push(toDate);

  if (financialYear) {
    const startYear = Number(financialYear.slice(0, 4));
    starts.push(`${startYear}-04-01`);
    ends.push(`${startYear + 1}-03-31`);
  }

  if (calendarYear) {
    starts.push(`${calendarYear}-01-01`);
    ends.push(`${calendarYear}-12-31`);
  }

  return {
    dateFrom: starts.length ? starts.sort().pop() : "",
    dateTo: ends.length ? ends.sort()[0] : "",
  };
};

// Shared filter boxes (used by both Nu and Ext)
const datesGroup = {
  title: "Dates",
  description: "Shows projects running during the selected period",
  fields: [
    { name: "fromDate", label: "From Date", type: "date" },
    { name: "toDate", label: "To Date", type: "date" },
    { name: "academicYear", label: "Academic Year", type: "select", options: ACADEMIC_YEARS, allLabel: "All Academic Years" },
    { name: "financialYear", label: "Financial Year", type: "select", options: FINANCIAL_YEARS, allLabel: "All Financial Years" },
    { name: "calendarYear", label: "Calendar Year", type: "select", options: CALENDAR_YEARS, allLabel: "All Calendar Years" },
  ],
};

const amountDurationGroup = {
  title: "Amount & Duration",
  fields: [
    { name: "minAmount", label: "Minimum Amount", type: "number", placeholder: "Min amount" },
    { name: "maxAmount", label: "Maximum Amount", type: "number", placeholder: "Max amount" },
    { name: "minDuration", label: "Minimum Duration", type: "number", placeholder: "Min years" },
    { name: "maxDuration", label: "Maximum Duration", type: "number", placeholder: "Max years" },
  ],
};

// ---------------------------------------------------------
// NU FUNDED PROJECTS
// ---------------------------------------------------------

export const nuProjectConfig = {
  title: "NU Funded Projects",
  entityName: "NU Funded Project",
  exportFileName: "NU_Funded_Projects",
  api: nuProjectApi,
  summaryPath: "/projects/nu/summary",
  tableMinWidth: "min-w-[1850px]",

  defaultFilters: {
    projectTitle: "",
    piSearch: "",
    coPiSearch: "",
    fromDate: "",
    toDate: "",
    academicYear: "",
    financialYear: "",
    calendarYear: "",
    projectCategory: "",
    outcome: "",
    minAmount: "",
    maxAmount: "",
    minDuration: "",
    maxDuration: "",
  },

  filterGroups: [
    {
      title: "Search",
      fields: [
        { name: "projectTitle", label: "Project Title", type: "text", placeholder: "Search project title" },
        { name: "piSearch", label: "Principal Investigator", type: "text", placeholder: "Search PI" },
        { name: "coPiSearch", label: "Co-Principal Investigator", type: "text", placeholder: "Search Co-PI" },
      ],
    },
    datesGroup,
    {
      title: "Project Details",
      fields: [
        { name: "projectCategory", label: "Project Category", type: "select", options: NU_CATEGORIES, allLabel: "All Categories" },
        { name: "outcome", label: "Outcome", type: "select", options: OUTCOME_OPTIONS, allLabel: "All Outcomes" },
      ],
    },
    amountDurationGroup,
  ],

  // filter state -> query params understood by /api/nu-funded-projects/filter
  toQueryParams: (filters) => {
    const { dateFrom, dateTo } = getDateRange(filters);

    return {
      projectTitle: filters.projectTitle,
      pi: filters.piSearch,
      coPi: filters.coPiSearch,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      projectCategory: filters.projectCategory,
      minDuration: filters.minDuration,
      maxDuration: filters.maxDuration,
      academicYear: filters.academicYear,
      outcome: filters.outcome,
      dateFrom,
      dateTo,
    };
  },

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
  exportFileName: "External_Funded_Projects",
  api: extProjectApi,
  summaryPath: "/projects/external/summary",
  tableMinWidth: "min-w-[1900px]",

  defaultFilters: {
    projectTitle: "",
    piSearch: "",
    coPiSearch: "",
    fundingAgencyName: "",
    fromDate: "",
    toDate: "",
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

  filterGroups: [
    {
      title: "Search",
      fields: [
        { name: "projectTitle", label: "Project Title", type: "text", placeholder: "Search project title" },
        { name: "piSearch", label: "Principal Investigator", type: "text", placeholder: "Search PI" },
        { name: "coPiSearch", label: "Co-Principal Investigator", type: "text", placeholder: "Search Co-PI" },
        { name: "fundingAgencyName", label: "Funding Agency", type: "text", placeholder: "Search funding agency" },
      ],
    },
    datesGroup,
    {
      title: "Project Details",
      fields: [
        { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, allLabel: "All Statuses" },
        { name: "outcome", label: "Outcome", type: "select", options: OUTCOME_OPTIONS, allLabel: "All Outcomes" },
      ],
    },
    amountDurationGroup,
  ],

  // filter state -> query params understood by /api/external-funded-projects/filter
  toQueryParams: (filters) => {
    const { dateFrom, dateTo } = getDateRange(filters);

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