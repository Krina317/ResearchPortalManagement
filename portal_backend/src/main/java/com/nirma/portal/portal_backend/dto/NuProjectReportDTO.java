package com.nirma.portal.portal_backend.dto;

import java.util.List;

/** NU Funded Projects report: Table A, Table 5.11 and the per-year detail tables. */
public record NuProjectReportDTO(
        String currentAcademicYear,
        Summary summary,                 // Table A
        Bifurcation bifurcation,         // Table 5.11
        List<YearDetails> details        // Table 5.12 (one block per year)
) {

    // ---------------- Table A ----------------
    public record Summary(List<YearSanctioned> years, long totalCaym1ToCaym3) {}

    public record YearSanctioned(String academicYear, String label, int projectCount, long amount) {}

    // ---------------- Table 5.11 ----------------
    public record Bifurcation(
            List<YearBifurcation> years,
            long totalAmountCaym1ToCaym3,
            long externalAmountCaym1ToCaym3,
            long nuAmountCaym1ToCaym3) {}

    public record YearBifurcation(
            String academicYear,
            String label,
            long totalAmount,
            long externalAmount,
            long nuAmount) {}

    // ---------------- Details ----------------
    public record YearDetails(String academicYear, String label, List<ProjectRow> projects) {}

    public record ProjectRow(
            int srNo,
            Long id,
            String projectTitle,
            String investigators,
            String category,        // NU-Minor / NU-Major
            Long amount,
            String duration) {}
}