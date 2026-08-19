package com.nirma.portal.portal_backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class JournalSearchCriteria {
    private String paperTitle;
    private String journalName;
    private String journalType;
    private List<String> departments;
    private String instituteName;
    private List<String> indexIn;
    private String issnNo;
    private String volumeNo;
    private String issueNo;
    private String pageNo;
    private String doiNumber;
    private String authorName;
    private List<Integer> authorPositions;
    private Integer fromYear;
    private String fromMonth;
    private Integer toYear;
    private String toMonth;
    private Integer academicYear;
    private Integer financialYear;
    private Integer calendarYear;
}