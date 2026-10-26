package com.nirma.portal.portal_backend.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JournalReportFilter {

    private static final List<String> MONTHS = List.of(
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER");

    private Integer academicYear;
    private Integer financialYear;
    private Integer calendarYear;
    private Integer fromYear;
    private String fromMonth;
    private Integer toYear;
    private String toMonth;

    /** year * 12 + month, same scale as the journal list search. */
    public Integer fromTotal() {
        if (fromYear != null) {
            return fromYear * 12 + (fromMonth != null && !fromMonth.isBlank() ? monthToNum(fromMonth) : 1);
        }
        if (academicYear != null) return academicYear * 12 + 7;
        if (financialYear != null) return financialYear * 12 + 4;
        if (calendarYear != null) return calendarYear * 12 + 1;
        return null;
    }

    public Integer toTotal() {
        if (toYear != null) {
            return toYear * 12 + (toMonth != null && !toMonth.isBlank() ? monthToNum(toMonth) : 12);
        }
        if (academicYear != null) return (academicYear + 1) * 12 + 6;
        if (financialYear != null) return (financialYear + 1) * 12 + 3;
        if (calendarYear != null) return calendarYear * 12 + 12;
        return null;
    }

    private static int monthToNum(String month) {
        String v = month.trim();
        try {
            int n = Integer.parseInt(v);
            if (n >= 1 && n <= 12) return n;
        } catch (NumberFormatException ignored) {
            // fall through to names
        }
        int idx = MONTHS.indexOf(v.toUpperCase());
        if (idx < 0) throw new IllegalArgumentException("Unrecognized month: " + month);
        return idx + 1;
    }
    
    private String quartile;   // "ALL", "Q1", "Q2", "Q1_Q2"

    /** null means no quartile filter. */
    public List<String> quartiles() {
        if (quartile == null || quartile.isBlank()) return null;
        return switch (quartile.toUpperCase().replaceAll("[^A-Z0-9]", "")) {
            case "Q1" -> List.of("Q1");
            case "Q2" -> List.of("Q2");
            case "Q1Q2" -> List.of("Q1", "Q2");
            default -> null;   // "ALL" or anything unknown
        };
    }
}