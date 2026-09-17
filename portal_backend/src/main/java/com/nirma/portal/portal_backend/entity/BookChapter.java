package com.nirma.portal.portal_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "BookChapter",
    indexes = {
        @Index(name = "idx_book_chapter_title", columnList = "bookChapterTitle"),
        @Index(name = "idx_book_title", columnList = "bookTitle"),
        @Index(name = "idx_book_chapter_department", columnList = "deptName"),
        @Index(name = "idx_book_chapter_publisher", columnList = "nameOfBookPublisher")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookChapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sourceId;

    @Column(nullable = false)
    private String bookTitle;

    @Column(nullable = false, unique = true, length = 500)
    private String bookChapterTitle;
    
    private String nameOfBookPublisher;

    private Integer month;

    private Integer year;

    private String yearOfPublication;

    private String isbnNo;
    
    private String fileName;

    private String publicationType;

    private String publicationCity;

    @Column(nullable = false)
    private String instituteName;

    @Column(nullable = false)
    private String deptName;
}