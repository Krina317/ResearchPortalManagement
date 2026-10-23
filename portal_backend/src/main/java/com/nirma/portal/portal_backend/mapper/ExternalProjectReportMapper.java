package com.nirma.portal.portal_backend.mapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.nirma.portal.portal_backend.dto.ExternalProjectReportDTO;
import com.nirma.portal.portal_backend.dto.ExternalProjectReportDTO.*;
import com.nirma.portal.portal_backend.entity.Projects;

/**
 * Builds the 4 report tables from the External Funded projects.
 *
 * Year logic (uses statusOfTheProject + academicYear + duration, NOT toDate):
 *  - SANCTIONED : the project's academicYear is this year.
 *  - ONGOING    : after the sanctioned year, up to the last planned year
 *                 (start + ceil(duration) - 1). If the status is anything other
 *                 than "completed", it stays ONGOING in every year up to the
 *                 current academic year, even past its planned duration.
 *  - COMPLETED  : status is "completed" and this is the last planned year.
 *  Each project has exactly one phase per year, so
 *  total = sanctioned + ongoing + completed.
 */
@Component
public class ExternalProjectReportMapper {

    private enum Phase { SANCTIONED, ONGOING, COMPLETED }

    private record Entry(Projects project, int start, int end, boolean completed) {}

    public ExternalProjectReportDTO toReport(List<Projects> projects, int realCay) {

        List<Entry> entries = projects.stream()
                .map(this::toEntry)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(e -> e.project().getId()))
                .toList();

        // The "current" year is the real current academic year, but never later than
        // the newest year that actually has data (no data for 2026-27 -> CAY = 2025-26).
        int maxStart = entries.stream().mapToInt(Entry::start).max().orElse(realCay);
        int cay = Math.min(realCay, maxStart);

        int first = entries.stream().mapToInt(Entry::start).min().orElse(cay);
        int last = Math.max(cay, maxStart);

        List<Integer> years = new ArrayList<>();
        for (int y = last; y >= first; y--) {
            years.add(y);
        }

        return new ExternalProjectReportDTO(
                ay(cay),
                tableOne(entries, years, cay),
                tableTwo(entries, years, cay),
                tableThree(entries, years, cay),
                tableFour(entries, years, cay));
    }

    // =====================================================================
    // Table I
    // =====================================================================
    private SanctionedSummary tableOne(List<Entry> entries, List<Integer> years, int cay) {
        List<YearSanctioned> rows = years.stream().map(y -> {
            List<Entry> sanctioned = sanctionedIn(entries, y);
            return new YearSanctioned(ay(y), label(y, cay), sanctioned.size(), sumAmount(sanctioned));
        }).toList();

        return new SanctionedSummary(
                rows,
                sumSanctioned(entries, cay - 3, cay - 1),
                sumSanctioned(entries, cay - 3, cay));
    }

    // =====================================================================
    // Table II
    // =====================================================================
    private DetailedSummary tableTwo(List<Entry> entries, List<Integer> years, int cay) {
        List<YearStatus> rows = years.stream().map(y -> {
            int sanctioned = 0, ongoing = 0, completed = 0;
            for (Entry e : entries) {
                Phase phase = phaseIn(e, y, cay);
                if (phase == Phase.SANCTIONED) sanctioned++;
                else if (phase == Phase.ONGOING) ongoing++;
                else if (phase == Phase.COMPLETED) completed++;
            }
            return new YearStatus(ay(y), label(y, cay),
                    sanctioned + ongoing + completed, sanctioned, ongoing, completed,
                    sumAmount(sanctionedIn(entries, y)));
        }).toList();

        return new DetailedSummary(
                rows,
                sumSanctioned(entries, cay - 3, cay - 1),
                sumSanctioned(entries, cay - 3, cay));
    }

    // =====================================================================
    // Table III  (projects sanctioned that year)
    // =====================================================================
    private List<YearSanctionedDetails> tableThree(List<Entry> entries, List<Integer> years, int cay) {
        List<YearSanctionedDetails> result = new ArrayList<>();
        for (int y : years) {
            List<Entry> sanctioned = sanctionedIn(entries, y);
            if (sanctioned.isEmpty()) continue;

            List<SanctionedRow> rows = new ArrayList<>();
            int sr = 1;
            for (Entry e : sanctioned) {
                Projects p = e.project();
                rows.add(new SanctionedRow(sr++, p.getId(), p.getProjectTitle(),
                        investigators(p), p.getFundingAgencyName(), p.getAmount(),
                        durationText(p.getDuration())));
            }
            result.add(new YearSanctionedDetails(ay(y), label(y, cay), rows));
        }
        return result;
    }

    // =====================================================================
    // Table IV  (sanctioned + ongoing + completed that year)
    // =====================================================================
    private List<YearProjectDetails> tableFour(List<Entry> entries, List<Integer> years, int cay) {
        List<YearProjectDetails> result = new ArrayList<>();
        for (int y : years) {
            List<Object[]> active = new ArrayList<>();   // {Entry, Phase}
            for (Entry e : entries) {
                Phase phase = phaseIn(e, y, cay);
                if (phase != null) active.add(new Object[] { e, phase });
            }
            if (active.isEmpty()) continue;

            // Sanctioned first, then Ongoing, then Completed (ids already ascending)
            active.sort(Comparator.comparingInt(a -> ((Phase) a[1]).ordinal()));

            List<ProjectRow> rows = new ArrayList<>();
            int sr = 1;
            for (Object[] a : active) {
                Projects p = ((Entry) a[0]).project();
                Phase phase = (Phase) a[1];
                rows.add(new ProjectRow(sr++, p.getId(), p.getProjectTitle(),
                        investigators(p), p.getFundingAgencyName(), p.getAmount(),
                        p.getFundReceived(), durationText(p.getDuration()),
                        statusLabel(phase), p.getRemarks()));
            }
            result.add(new YearProjectDetails(ay(y), label(y, cay), rows));
        }
        return result;
    }

    // =====================================================================
    // Helpers
    // =====================================================================
    private Entry toEntry(Projects p) {
        Integer start = parseStartYear(p.getAcademicYear());
        if (start == null) return null;

        double duration = p.getDuration() == null ? 1 : p.getDuration();
        int years = (int) Math.max(1, Math.ceil(duration - 1e-9));
        int end = start + years - 1;

        String status = p.getStatusOfTheProject();
        boolean completed = status != null && status.toLowerCase().contains("complet");

        return new Entry(p, start, end, completed);
    }

    private Phase phaseIn(Entry e, int y, int cay) {
        if (y < e.start()) return null;
        if (y == e.start()) return Phase.SANCTIONED;

        if (e.completed()) {
            if (y < e.end()) return Phase.ONGOING;
            return y == e.end() ? Phase.COMPLETED : null;
        }
        // Not completed: keep counting it until the current year (or its planned end)
        return y <= Math.max(e.end(), cay) ? Phase.ONGOING : null;
    }

    private List<Entry> sanctionedIn(List<Entry> entries, int year) {
        return entries.stream().filter(e -> e.start() == year).toList();
    }

    private long sumSanctioned(List<Entry> entries, int fromYear, int toYear) {
        return entries.stream()
                .filter(e -> e.start() >= fromYear && e.start() <= toYear)
                .mapToLong(e -> amount(e.project()))
                .sum();
    }

    private long sumAmount(List<Entry> entries) {
        return entries.stream().mapToLong(e -> amount(e.project())).sum();
    }

    private long amount(Projects p) {
        return p.getAmount() == null ? 0L : p.getAmount();
    }

    /** "2022-2023" -> 2022 */
    private Integer parseStartYear(String academicYear) {
        if (academicYear == null || academicYear.isBlank()) return null;
        try {
            return Integer.parseInt(academicYear.trim().split("[-/\\s]")[0]);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /** 2022 -> "2022-2023" (same format as stored in the DB) */
    private String ay(int startYear) {
        return startYear + "-" + (startYear + 1);
    }

    private String label(int year, int cay) {
        int offset = cay - year;
        if (offset == 0) return "CAY";
        if (offset >= 1 && offset <= 3) return "CAYm" + offset;
        return "";
    }

    private String investigators(Projects p) {
        String co = p.getCoPrincipalInvestigatorList();
        if (co == null || co.isBlank() || co.trim().equals("-")) {
            return p.getPrincipalInvestigator();
        }
        return p.getPrincipalInvestigator() + ", " + co.trim();
    }

    private String durationText(Double d) {
        if (d == null) return "-";
        if (d == Math.rint(d)) return String.valueOf(d.longValue());
        double months = d * 12;
        if (months == Math.rint(months)) return (long) months + " months";
        return String.valueOf(d);
    }

    private String statusLabel(Phase phase) {
        return switch (phase) {
            case SANCTIONED -> "Sanctioned";
            case ONGOING -> "Ongoing";
            case COMPLETED -> "Completed";
        };
    }
}