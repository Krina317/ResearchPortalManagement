package com.nirma.portal.portal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookChapterResponseDTO {

    private Long id;

    private String bookTitle;

    private String bookChapterTitle;

    private String nameOfBookPublisher;

    private Integer month;

    private Integer year;

    private String yearOfPublication;

    private String isbnNo;
    private String fileName;

    private String publicationType;

    private String publicationCity;

    private String instituteName;

    private String deptName;
}