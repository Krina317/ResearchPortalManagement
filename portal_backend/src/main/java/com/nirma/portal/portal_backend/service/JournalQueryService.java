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
import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.JournalFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.JournalPaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.JournalPaperNotFoundException;
import com.nirma.portal.portal_backend.mapper.AuthorRecordMapper;
import com.nirma.portal.portal_backend.repository.AuthorRecordRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.ExcelColumnMapRepository;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JournalQueryService {

    private static final List<String> MONTHS = List.of(
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER");

    private final JournalPaperRepository journalPaperRepository;
    private final AuthorRecordRepository authorRecordRepository;
    private final ExcelColumnMapRepository excelColumnMapRepository;
    private final AuthorRecordMapper authorRecordMapper;
    private final DepartmentListRepository departmentListRepository;

    @Transactional(readOnly = true)
    public Page<JournalListItemDTO> search(JournalSearchCriteria criteria, Pageable pageable) {

        List<Long> authorIds = null;
        boolean hasAuthorFilter = notBlank(criteria.getAuthorName())
                || (criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty());
        if (hasAuthorFilter) {
            boolean hasPositions = criteria.getAuthorPositions() != null && !criteria.getAuthorPositions().isEmpty();
            authorIds = authorRecordRepository.findMatchingPublicationIds(
                    PublicationType.JOURNAL.name(),
                    blankToNull(criteria.getAuthorName()),
                    hasPositions,
                    hasPositions ? criteria.getAuthorPositions() : List.of()
            );
        }

        Integer fromTotal = resolveFromTotal(criteria);
        Integer toTotal = resolveToTotal(criteria);

        Page<JournalPaper> page = journalPaperRepository.search(
                criteria, fromTotal, toTotal, criteria.getIndexIn(), authorIds, pageable
        );

        List<Long> pageIds = page.getContent().stream().map(JournalPaper::getId).toList();
        Map<Long, List<AuthorRecord>> authorsByPaperId = fetchAuthorsFor(pageIds);

        return page.map(paper -> toListItem(paper, authorsByPaperId));
    }

    @Transactional(readOnly = true)
    public JournalListItemDTO getById(Long id) {
        JournalPaper paper = journalPaperRepository.findById(id)
                .orElseThrow(() -> new JournalPaperNotFoundException("Journal paper " + id + " not found"));
        return toListItem(paper, fetchAuthorsFor(List.of(id)));
    }

    @Transactional(readOnly = true)
    public List<ColumnMetaDTO> getColumns() {
        List<ColumnMetaDTO> columns = excelColumnMapRepository
                .findByPublicationTypeAndEnabledTrue(PublicationType.JOURNAL)
                .stream()
                .filter(m -> "JournalPaper".equals(m.getEntityName()))
                .map(m -> new ColumnMetaDTO(m.getFieldName(), m.getExcelColName()))
                .collect(Collectors.toList());
        columns.add(new ColumnMetaDTO("authors", "Authors"));
        return columns;
    }

    @Transactional(readOnly = true)
    public long getTotalCount() {
        return journalPaperRepository.count();
    }

    // -- year/month resolution --
    // Priority when multiple are supplied: explicit fromYear/fromMonth (or
    // toYear/toMonth) wins; otherwise fall back to whichever of
    // academicYear/financialYear/calendarYear was set. These three are
    // expected to be mutually exclusive in the UI, not combined.

    private Integer resolveFromTotal(JournalSearchCriteria c) {
        if (c.getFromYear() != null) {
            int month = c.getFromMonth() != null ? monthToNum(c.getFromMonth()) : 1;
            return c.getFromYear() * 12 + month;
        }
        if (c.getAcademicYear() != null) {
            return c.getAcademicYear() * 12 + 7; // July
        }
        if (c.getFinancialYear() != null) {
            return c.getFinancialYear() * 12 + 4; // April
        }
        if (c.getCalendarYear() != null) {
            return c.getCalendarYear() * 12 + 1; // January
        }
        return null;
    }

    private Integer resolveToTotal(JournalSearchCriteria c) {
        if (c.getToYear() != null) {
            int month = c.getToMonth() != null ? monthToNum(c.getToMonth()) : 12;
            return c.getToYear() * 12 + month;
        }
        if (c.getAcademicYear() != null) {
            return (c.getAcademicYear() + 1) * 12 + 6; // June next year
        }
        if (c.getFinancialYear() != null) {
            return (c.getFinancialYear() + 1) * 12 + 3; // March next year
        }
        if (c.getCalendarYear() != null) {
            return c.getCalendarYear() * 12 + 12; // December
        }
        return null;
    }

    private int monthToNum(String month) {
        if (month == null || month.isBlank()) {
            throw new IllegalArgumentException("Month cannot be blank");
        }

        String value = month.trim();

        // Accept numeric month values: "1" to "12"
        try {
            int numericMonth = Integer.parseInt(value);

            if (numericMonth >= 1 && numericMonth <= 12) {
                return numericMonth;
            }
        } catch (NumberFormatException ignored) {
            // Not numeric, so continue with month-name handling
        }

        // Accept month names: January, February, etc.
        int idx = MONTHS.indexOf(value.toUpperCase());

        if (idx < 0) {
            throw new IllegalArgumentException("Unrecognized month: " + month);
        }

        return idx + 1;
    }

    // -- helpers --

    private Map<Long, List<AuthorRecord>> fetchAuthorsFor(List<Long> paperIds) {
        if (paperIds.isEmpty()) {
            return Map.of();
        }
        return authorRecordRepository
                .findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(paperIds, PublicationType.JOURNAL)
                .stream()
                .collect(Collectors.groupingBy(AuthorRecord::getPublicationId));
    }

    private JournalListItemDTO toListItem(JournalPaper paper, Map<Long, List<AuthorRecord>> authorsByPaperId) {
        List<AuthorRecord> authorEntities = authorsByPaperId.getOrDefault(paper.getId(), List.of())
                .stream()
                .sorted(Comparator.comparing(AuthorRecord::getAuthorPosition))
                .toList();

        List<AuthorRecordResponseDTO> authorDtos = authorRecordMapper.toResponseDTOList(authorEntities);
        String merged = authorEntities.stream()
                .map(AuthorRecord::getDisplayName)
                .collect(Collectors.joining(", "));

        return new JournalListItemDTO(
                paper.getId(), paper.getSourceId(), paper.getPaperTitle(), paper.getJournalName(),
                paper.getJournalType(), paper.getImpactFactorClarivate(), paper.getImpactFactorJournal(),
                paper.getYearOfPublication(), paper.getMonthOfPublication(), paper.getIndexIn(),
                paper.getIssnNo(), paper.getVolumeNo(), paper.getIssueNo(), paper.getPageNo(),
                paper.getWebsiteJournalLink(), paper.getArticleLink(), paper.getDoiNumber(),
                paper.getInstituteName(), paper.getDeptName(),
                authorDtos, merged, paper.getDownloadFileLink()
        );
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    private String blankToNull(String s) {
        return notBlank(s) ? s : null;
    }

    @Transactional(readOnly = true)
    public JournalFilterOptionsDTO getFilterOptions() {
        List<String> journalTypes = journalPaperRepository.findAll()
                .stream()
                .map(JournalPaper::getJournalType)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        List<String> institutes = journalPaperRepository.findAll()
                .stream()
                .map(JournalPaper::getInstituteName)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        List<String> departments = departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.JOURNAL)
                .stream()
                .map(DepartmentList::getDeptName)
                .toList();

        List<String> indexIn = journalPaperRepository.findAll()
                .stream()
                .map(JournalPaper::getIndexIn)
                .filter(Objects::nonNull)
                .flatMap(value -> java.util.Arrays.stream(value.split(",")))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .distinct()
                .sorted()
                .toList();

        return new JournalFilterOptionsDTO(
                journalTypes,
                institutes,
                departments,
                indexIn
        );
    }
    
}