package com.nirma.portal.portal_backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookChapterSearchCriteria {

    private String bookTitle;

    private String bookChapterTitle;

    private String nameOfBookPublisher;

    private List<String> departments;

    private String instituteName;

    private String publicationType;

    private String publicationCity;

    private String yearOfPublication;

    private String isbnNo;

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