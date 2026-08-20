// ============================================================
// DATE / MONTH / YEAR OPTIONS
// ============================================================

// January -> December
export const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
];


// ============================================================
// CALENDAR YEARS
// Example:
// 2026
// 2025
// 2024
// ...
// 2020
//
// Automatically moves forward every year.
// In 2027 it becomes:
// 2027, 2026, 2025 ... 2020
// ============================================================

export function generateCalendarYears(
    startYear = 2020
) {
    const currentYear = new Date().getFullYear();

    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
        years.push({
            value: year,
            label: String(year)
        });
    }

    return years;
}


// ============================================================
// ACADEMIC / FINANCIAL YEARS
//
// Example:
// 2026-27
// 2025-26
// 2024-25
// ...
//
// These labels are the same for Academic and Financial Year.
// The backend/filter logic determines whether the period means:
//
// Academic: July -> June
// Financial: April -> March
// ============================================================

export function generateFinancialAcademicYears(
    startYear = 2020
) {
    const currentYear = new Date().getFullYear();

    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
        const nextYear = String(year + 1).slice(-2);

        years.push({
            value: `${year}-${nextYear}`,
            label: `${year}-${nextYear}`
        });
    }

    return years;
}


// ============================================================
// ALL DATE OPTIONS
// ============================================================

export function getDateOptions() {
    return {
        months: MONTHS,
        years: generateCalendarYears(),
        academicYears: generateFinancialAcademicYears(),
        financialYears: generateFinancialAcademicYears()
    };
}