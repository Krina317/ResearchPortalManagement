package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceReportFilter {

    private Integer academicYear;
    private Integer financialYear;
    private Integer calendarYear;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    public LocalDate resolveFrom() {
        if (fromDate != null || toDate != null) return fromDate;
        if (academicYear != null) return LocalDate.of(academicYear, 7, 1);
        if (financialYear != null) return LocalDate.of(financialYear, 4, 1);
        if (calendarYear != null) return LocalDate.of(calendarYear, 1, 1);
        return null;
    }

    public LocalDate resolveTo() {
        if (fromDate != null || toDate != null) return toDate;
        if (academicYear != null) return LocalDate.of(academicYear + 1, 6, 30);
        if (financialYear != null) return LocalDate.of(financialYear + 1, 3, 31);
        if (calendarYear != null) return LocalDate.of(calendarYear, 12, 31);
        return null;
    }
}