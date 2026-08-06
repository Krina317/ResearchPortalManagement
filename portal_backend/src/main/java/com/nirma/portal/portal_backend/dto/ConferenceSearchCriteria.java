package com.nirma.portal.portal_backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConferenceSearchCriteria {
    private String conferenceName;         // contains
    private String paperTitle;             // contains
    private String conferenceType;         // exact, null/"ALL" = no filter
    private List<String> departments;      // IN (...)
    private String instituteName;          // exact, null/"ALL" = no filter

    private String authorName;             // contains, matched against AuthorRecord
    private List<Integer> authorPositions; // IN (...), matched against AuthorRecord

    private LocalDate fromDate;            // lower bound on paper.fromDate
    private LocalDate toDate;              // upper bound on paper.fromDate

    private Integer academicYear;          // start year, e.g. 2025 -> Jul 2025 to Jun 2026
    private Integer financialYear;         // start year, e.g. 2025 -> Apr 2025 to Mar 2026
    private Integer calendarYear;          // e.g. 2025 -> Jan 2025 to Dec 2025
}