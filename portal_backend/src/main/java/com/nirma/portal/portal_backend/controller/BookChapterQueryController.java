package com.nirma.portal.portal_backend.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.BookChapterFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.BookChapterListItemDTO;
import com.nirma.portal.portal_backend.dto.BookChapterSearchCriteria;
import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.service.BookChapterQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/book-chapters")
@RequiredArgsConstructor
public class BookChapterQueryController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("id", "year");

    private final BookChapterQueryService bookChapterQueryService;

    @GetMapping
    public Page<BookChapterListItemDTO> search(

            @RequestParam(required = false) String bookTitle,

            @RequestParam(required = false) String bookChapterTitle,

            @RequestParam(required = false) String nameOfBookPublisher,

            @RequestParam(required = false) List<String> department,

            @RequestParam(required = false) String instituteName,

            @RequestParam(required = false) String publicationType,

            @RequestParam(required = false) String publicationCity,

            @RequestParam(required = false) String yearOfPublication,

            @RequestParam(required = false) String isbnNo,

            @RequestParam(required = false) String authorName,

            @RequestParam(required = false) List<Integer> authorPosition,

            @RequestParam(required = false) Integer fromYear,

            @RequestParam(required = false) String fromMonth,

            @RequestParam(required = false) Integer toYear,

            @RequestParam(required = false) String toMonth,

            @RequestParam(required = false) Integer academicYear,

            @RequestParam(required = false) Integer financialYear,

            @RequestParam(required = false) Integer calendarYear,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "20") int size,

            @RequestParam(defaultValue = "year") String sortBy,

            @RequestParam(defaultValue = "DESC") String sortDir
    ) {

        String safeSortBy =
                ALLOWED_SORT_FIELDS.contains(sortBy)
                        ? sortBy
                        : "year";

        BookChapterSearchCriteria criteria =
                new BookChapterSearchCriteria(
                        bookTitle,
                        bookChapterTitle,
                        nameOfBookPublisher,
                        department,
                        instituteName,
                        publicationType,
                        publicationCity,
                        yearOfPublication,
                        isbnNo,
                        authorName,
                        authorPosition,
                        fromYear,
                        fromMonth,
                        toYear,
                        toMonth,
                        academicYear,
                        financialYear,
                        calendarYear
                );

        Sort sort = Sort.by(
                Sort.Direction.fromString(sortDir),
                safeSortBy
        );

        Pageable pageable =
                PageRequest.of(page, size, sort);

        return bookChapterQueryService.search(
                criteria,
                pageable
        );
    }

    @GetMapping("/{id}")
    public BookChapterListItemDTO getById(
            @PathVariable Long id) {

        return bookChapterQueryService.getById(id);
    }

    @GetMapping("/columns")
    public List<ColumnMetaDTO> getColumns() {

        return bookChapterQueryService.getColumns();
    }

    @GetMapping("/filter-options")
    public BookChapterFilterOptionsDTO getFilterOptions() {

        return bookChapterQueryService.getFilterOptions();
    }
}