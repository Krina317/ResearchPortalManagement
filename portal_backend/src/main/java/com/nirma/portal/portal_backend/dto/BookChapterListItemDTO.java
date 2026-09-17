package com.nirma.portal.portal_backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookChapterListItemDTO {

    private Long id;

    private Long sourceId;

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

    private List<AuthorRecordResponseDTO> authors;

    private String authorsMerged;
}