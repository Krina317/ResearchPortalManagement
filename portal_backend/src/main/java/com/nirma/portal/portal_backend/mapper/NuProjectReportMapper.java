package com.nirma.portal.portal_backend.mapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.nirma.portal.portal_backend.dto.NuProjectReportDTO;
import com.nirma.portal.portal_backend.dto.NuProjectReportDTO.*;
import com.nirma.portal.portal_backend.entity.Projects;

/**
 * Builds the NU report. A project belongs to the academic year stored in
 * its academicYear field (e.g. "2024-2025").
 * Same CAY rule as the external report: real current academic year, but never
 * later than the newest year that has data (NU or external).
 */
@Component
public class NuProjectReportMapper {

    private record Item(Projects project, int year) {}

    public NuProjectReportDTO toReport(List<Projects> nuProjects, List<Projects> extProjects, int realCay) {

        List<Item> nu = items(nuProjects);
        List<Item> ext = items(extProjects);

        List<Item> all = new ArrayList<>(nu);
        all.addAll(ext);

        int maxYear = all.stream().mapToInt(Item::year).max().orElse(realCay);
        int cay = Math.min(realCay, maxYear);
        int first = all.stream().mapToInt(Item::year).min().orElse(cay);
        int last = Math.max(cay, maxYear);

        List<Integer> years = new ArrayList<>();
        for (int y = last; y >= first; y--) years.add(y);

        // ---- Table A
        List<YearSanctioned> summaryRows = years.stream().map(y -> {
            List<Item> inYear = inYear(nu, y);
            return new YearSanctioned(ay(y), label(y, cay), inYear.size(), sum(inYear));
        }).toList();
        Summary summary = new Summary(summaryRows, sumRange(nu, cay - 3, cay - 1));

        // ---- Table 5.11
        List<YearBifurcation> bifRows = years.stream().map(y -> {
            long n = sum(inYear(nu, y));
            long e = sum(inYear(ext, y));
            return new YearBifurcation(ay(y), label(y, cay), n + e, e, n);
        }).toList();
        long nuPast = sumRange(nu, cay - 3, cay - 1);
        long extPast = sumRange(ext, cay - 3, cay - 1);
        Bifurcation bifurcation = new Bifurcation(bifRows, nuPast + extPast, extPast, nuPast);

        // ---- Detail tables
        List<YearDetails> details = new ArrayList<>();
        for (int y : years) {
            List<Item> inYear = inYear(nu, y);
            if (inYear.isEmpty()) continue;

            List<ProjectRow> rows = new ArrayList<>();
            int sr = 1;
            for (Item it : inYear) {
                Projects p = it.project();
                rows.add(new ProjectRow(sr++, p.getId(), p.getProjectTitle(), investigators(p),
                        category(p), p.getAmount(), durationText(p.getDuration())));
            }
            details.add(new YearDetails(ay(y), label(y, cay), rows));
        }

        return new NuProjectReportDTO(ay(cay), summary, bifurcation, details);
    }

    // ------------------------------------------------------------ helpers
    private List<Item> items(List<Projects> projects) {
        return projects.stream()
                .map(p -> {
                    Integer y = parseStartYear(p.getAcademicYear());
                    return y == null ? null : new Item(p, y);
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(i -> i.project().getId()))
                .toList();
    }

    private List<Item> inYear(List<Item> items, int year) {
        return items.stream().filter(i -> i.year() == year).toList();
    }

    private long sum(List<Item> items) {
        return items.stream().mapToLong(i -> i.project().getAmount() == null ? 0L : i.project().getAmount()).sum();
    }

    private long sumRange(List<Item> items, int from, int to) {
        return sum(items.stream().filter(i -> i.year() >= from && i.year() <= to).toList());
    }

    private Integer parseStartYear(String academicYear) {
        if (academicYear == null || academicYear.isBlank()) return null;
        try {
            return Integer.parseInt(academicYear.trim().split("[-/\\s]")[0]);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

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
        if (co == null || co.isBlank() || co.trim().equals("-")) return p.getPrincipalInvestigator();
        return p.getPrincipalInvestigator() + ", " + co.trim();
    }

    private String category(Projects p) {
        String c = p.getNuProjectCategory();
        return (c == null || c.isBlank()) ? p.getFundingAgencyName() : c;
    }

    private String durationText(Double d) {
        if (d == null) return "-";
        if (d == Math.rint(d)) return String.valueOf(d.longValue());
        double months = d * 12;
        if (months == Math.rint(months)) return (long) months + " months";
        return String.valueOf(d);
    }
}