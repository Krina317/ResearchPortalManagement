package com.nirma.portal.portal_backend.dto;

import java.util.List;

/**
 * Whole External Funded Projects report (all 4 tables) in one response.
 * Years are always listed newest -> oldest.
 * "label" is CAY / CAYm1 / CAYm2 / CAYm3 (empty for older or future years).
 */
public record ExternalProjectReportDTO(
        String currentAcademicYear,
        SanctionedSummary sanctionedSummary,          // Table I
        DetailedSummary detailedSummary,              // Table II
        List<YearSanctionedDetails> sanctionedDetails, // Table III
        List<YearProjectDetails> yearWiseDetails       // Table IV
) {

    // ---------------- Table I ----------------
    public record SanctionedSummary(
            List<YearSanctioned> years,
            long totalCaym1ToCaym3,
            long totalCayToCaym3) {}

    public record YearSanctioned(
            String academicYear,
            String label,
            int projectCount,
            long amount) {}

    // ---------------- Table II ----------------
    public record DetailedSummary(
            List<YearStatus> years,
            long totalCaym1ToCaym3,
            long totalCayToCaym3) {}

    public record YearStatus(
            String academicYear,
            String label,
            int totalProjects,
            int sanctioned,
            int ongoing,
            int completed,
            long sanctionedAmount) {}

    // ---------------- Table III ----------------
    public record YearSanctionedDetails(
            String academicYear,
            String label,
            List<SanctionedRow> projects) {}

    public record SanctionedRow(
            int srNo,
            Long id,
            String projectTitle,
            String investigators,   // PI + Co-PIs
            String fundingAgency,
            Long amount,
            String duration) {}

    // ---------------- Table IV ----------------
    public record YearProjectDetails(
            String academicYear,
            String label,
            List<ProjectRow> projects) {}

    public record ProjectRow(
            int srNo,
            Long id,
            String projectTitle,
            String investigators,
            String fundingAgency,
            Long amount,
            String fundReceived,
            String duration,
            String status,          // Sanctioned / Ongoing / Completed (for that year)
            String remarks) {}
}