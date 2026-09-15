package com.nirma.portal.portal_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookChapterRequestDTO {

    @NotNull(message = "ID is required")
    private Long id;

    @NotBlank(message = "Book title is required")
    private String bookTitle;

    @NotBlank(message = "Book chapter title is required")
    private String bookChapterTitle;

    private String nameOfBookPublisher;

    private Integer month;

    private Integer year;

    private String yearOfPublication;

    private String isbnNo;

    private String publicationType;

    private String publicationCity;

    @NotBlank(message = "Institute name is required")
    private String instituteName;

    @NotBlank(message = "Department name is required")
    private String deptName;
}