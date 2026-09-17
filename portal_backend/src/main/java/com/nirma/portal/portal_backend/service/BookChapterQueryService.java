package com.nirma.portal.portal_backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.AuthorRecordResponseDTO;
import com.nirma.portal.portal_backend.dto.BookChapterFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.BookChapterListItemDTO;
import com.nirma.portal.portal_backend.dto.BookChapterSearchCriteria;
import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.BookChapter;
import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.BookChapterNotFoundException;
import com.nirma.portal.portal_backend.mapper.AuthorRecordMapper;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookChapterQueryService {

    private final BookChapterRepository bookChapterRepository;
    private final AuthorRecordRepository authorRecordRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final AuthorRecordMapper authorRecordMapper;
    private final DepartmentListRepository departmentListRepository;

    @Transactional(readOnly = true)
    public Page<BookChapterListItemDTO> search(
            BookChapterSearchCriteria criteria,
            Pageable pageable) {

        List<Long> authorIds = null;

        boolean hasAuthorFilter =
                notBlank(criteria.getAuthorName())
                || (criteria.getAuthorPositions() != null
                    && !criteria.getAuthorPositions().isEmpty());

        if (hasAuthorFilter) {

            boolean hasPositions =
                    criteria.getAuthorPositions() != null
                    && !criteria.getAuthorPositions().isEmpty();

            authorIds = authorRecordRepository.findMatchingPublicationIds(
                    PublicationType.BOOK_CHAPTER.name(),
                    blankToNull(criteria.getAuthorName()),
                    hasPositions,
                    hasPositions
                            ? criteria.getAuthorPositions()
                            : List.of()
            );
        }

        Integer fromTotal = resolveFromTotal(criteria);
        Integer toTotal = resolveToTotal(criteria);

        Page<BookChapter> page =
                bookChapterRepository.search(
                        criteria,
                        fromTotal,
                        toTotal,
                        authorIds,
                        pageable
                );

        List<Long> pageIds =
                page.getContent()
                        .stream()
                        .map(BookChapter::getId)
                        .toList();

        Map<Long, List<AuthorRecord>> authorsByBookChapterId =
                fetchAuthorsFor(pageIds);

        return page.map(
                bookChapter ->
                        toListItem(
                                bookChapter,
                                authorsByBookChapterId
                        )
        );
    }

    @Transactional(readOnly = true)
    public BookChapterListItemDTO getById(Long id) {

        BookChapter bookChapter =
                bookChapterRepository.findById(id)
                        .orElseThrow(() ->
                                new BookChapterNotFoundException(
                                        "Book chapter " + id + " not found"
                                )
                        );

        return toListItem(
                bookChapter,
                fetchAuthorsFor(List.of(id))
        );
    }

    @Transactional(readOnly = true)
    public List<ColumnMetaDTO> getColumns() {

        List<ColumnMetaDTO> columns =
                excelColumnMapRepository
                        .findByPublicationTypeAndEnabledTrue(
                                PublicationType.BOOK_CHAPTER
                        )
                        .stream()
                        .filter(m ->
                                "BookChapter".equals(
                                        m.getEntityName()
                                )
                        )
                        .map(m ->
                                new ColumnMetaDTO(
                                        m.getFieldName(),
                                        m.getExcelColName()
                                )
                        )
                        .collect(Collectors.toList());

        columns.add(
                new ColumnMetaDTO(
                        "authors",
                        "Authors"
                )
        );

        return columns;
    }

    @Transactional(readOnly = true)
    public long getTotalCount() {
        return bookChapterRepository.count();
    }

    // ---------------------------------------------------------
    // Year / Month resolution
    // ---------------------------------------------------------

    private Integer resolveFromTotal(
            BookChapterSearchCriteria c) {

        if (c.getFromYear() != null) {

            int month =
                    c.getFromMonth() != null
                            ? parseMonth(c.getFromMonth())
                            : 1;

            return c.getFromYear() * 12 + month;
        }

        if (c.getAcademicYear() != null) {
            return c.getAcademicYear() * 12 + 7;
        }

        if (c.getFinancialYear() != null) {
            return c.getFinancialYear() * 12 + 4;
        }

        if (c.getCalendarYear() != null) {
            return c.getCalendarYear() * 12 + 1;
        }

        return null;
    }

    private Integer resolveToTotal(
            BookChapterSearchCriteria c) {

        if (c.getToYear() != null) {

            int month =
                    c.getToMonth() != null
                            ? parseMonth(c.getToMonth())
                            : 12;

            return c.getToYear() * 12 + month;
        }

        if (c.getAcademicYear() != null) {
            return (c.getAcademicYear() + 1) * 12 + 6;
        }

        if (c.getFinancialYear() != null) {
            return (c.getFinancialYear() + 1) * 12 + 3;
        }

        if (c.getCalendarYear() != null) {
            return c.getCalendarYear() * 12 + 12;
        }

        return null;
    }

    private int parseMonth(String month) {

        if (month == null || month.isBlank()) {
            throw new IllegalArgumentException(
                    "Month cannot be blank"
            );
        }

        try {

            int value =
                    Integer.parseInt(month.trim());

            if (value >= 1 && value <= 12) {
                return value;
            }

        } catch (NumberFormatException ignored) {
            // Fall through to month-name handling.
        }

        String upper =
                month.trim().toUpperCase();

        List<String> months = List.of(
                "JANUARY",
                "FEBRUARY",
                "MARCH",
                "APRIL",
                "MAY",
                "JUNE",
                "JULY",
                "AUGUST",
                "SEPTEMBER",
                "OCTOBER",
                "NOVEMBER",
                "DECEMBER"
        );

        int index = months.indexOf(upper);

        if (index >= 0) {
            return index + 1;
        }

        throw new IllegalArgumentException(
                "Unrecognized month: " + month
        );
    }

    // ---------------------------------------------------------
    // Author handling
    // ---------------------------------------------------------

    private Map<Long, List<AuthorRecord>> fetchAuthorsFor(
            List<Long> bookChapterIds) {

        if (bookChapterIds.isEmpty()) {
            return Map.of();
        }

        return authorRecordRepository
                .findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(
                        bookChapterIds,
                        PublicationType.BOOK_CHAPTER
                )
                .stream()
                .collect(
                        Collectors.groupingBy(
                                AuthorRecord::getPublicationId
                        )
                );
    }

    private BookChapterListItemDTO toListItem(
            BookChapter bookChapter,
            Map<Long, List<AuthorRecord>> authorsByBookChapterId) {

        List<AuthorRecord> authorEntities =
                authorsByBookChapterId
                        .getOrDefault(
                                bookChapter.getId(),
                                List.of()
                        )
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        AuthorRecord::getAuthorPosition
                                )
                        )
                        .toList();

        List<AuthorRecordResponseDTO> authorDtos =
                authorRecordMapper.toResponseDTOList(
                        authorEntities
                );

        String merged =
                authorEntities
                        .stream()
                        .map(AuthorRecord::getDisplayName)
                        .collect(
                                Collectors.joining(", ")
                        );

        return new BookChapterListItemDTO(
                bookChapter.getId(),
                bookChapter.getSourceId(),
                bookChapter.getBookTitle(),
                bookChapter.getBookChapterTitle(),
                bookChapter.getNameOfBookPublisher(),
                bookChapter.getMonth(),
                bookChapter.getYear(),
                bookChapter.getYearOfPublication(),
                bookChapter.getIsbnNo(),
                bookChapter.getFileName(),
                bookChapter.getPublicationType(),
                bookChapter.getPublicationCity(),
                bookChapter.getInstituteName(),
                bookChapter.getDeptName(),
                authorDtos,
                merged
        );
    }

    // ---------------------------------------------------------
    // Filter options
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public BookChapterFilterOptionsDTO getFilterOptions() {

        List<String> publicationTypes =
                bookChapterRepository
                        .findDistinctPublicationTypes();

        List<String> publicationCities =
                bookChapterRepository
                        .findDistinctPublicationCities();

        List<String> yearOfPublications =
                bookChapterRepository
                        .findDistinctYearsOfPublication();

        List<String> institutes =
                bookChapterRepository
                        .findDistinctInstituteNames();

        List<String> departments =
                departmentListRepository
                        .findByPublicationTypeAndActiveTrue(
                                PublicationType.BOOK_CHAPTER
                        )
                        .stream()
                        .map(DepartmentList::getDeptName)
                        .filter(Objects::nonNull)
                        .distinct()
                        .sorted()
                        .toList();

        return new BookChapterFilterOptionsDTO(
                publicationTypes,
                publicationCities,
                yearOfPublications,
                institutes,
                departments
        );
    }

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    private String blankToNull(String s) {
        return notBlank(s) ? s : null;
    }
}