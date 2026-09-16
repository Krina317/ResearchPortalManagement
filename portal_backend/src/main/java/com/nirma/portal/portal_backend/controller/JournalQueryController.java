package com.nirma.portal.portal_backend.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.JournalFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.service.JournalQueryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalQueryController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("id", "yearOfPublication");

    private final JournalQueryService journalQueryService;

    @GetMapping
    public Page<JournalListItemDTO> search(
            @RequestParam(required = false) String paperTitle,
            @RequestParam(required = false) String journalName,
            @RequestParam(required = false) String journalType,
            @RequestParam(required = false) List<String> department,
            @RequestParam(required = false) String instituteName,
            @RequestParam(required = false) List<String> indexIn,
            @RequestParam(required = false) String issnNo,
            @RequestParam(required = false) String volumeNo,
            @RequestParam(required = false) String issueNo,
            @RequestParam(required = false) String pageNo,
            @RequestParam(required = false) String doiNumber,
            @RequestParam(required = false) String articleLink,
            @RequestParam(required = false) Double minImpactFactorClarivate,
            @RequestParam(required = false) Double maxImpactFactorClarivate,
            @RequestParam(required = false) Double minImpactFactorJournal,
            @RequestParam(required = false) Double maxImpactFactorJournal,
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
            @RequestParam(defaultValue = "yearOfPublication") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        log.trace("Entered journal search()");

        String safeSortBy =
                ALLOWED_SORT_FIELDS.contains(sortBy)
                        ? sortBy
                        : "yearOfPublication";

        if (!safeSortBy.equals(sortBy)) {
            log.warn(
                    "Invalid journal sort field '{}', defaulting to '{}'",
                    sortBy,
                    safeSortBy
            );
        }

        JournalSearchCriteria criteria = new JournalSearchCriteria(
                paperTitle,
                journalName,
                journalType,
                department,
                instituteName,
                indexIn,
                issnNo,
                volumeNo,
                issueNo,
                pageNo,
                doiNumber,
                articleLink,
                minImpactFactorClarivate,
                maxImpactFactorClarivate,
                minImpactFactorJournal,
                maxImpactFactorJournal,
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

        Pageable pageable = PageRequest.of(page, size, sort);

        log.debug(
                "Searching journal papers: page={}, size={}, sortBy={}, sortDir={}",
                page,
                size,
                safeSortBy,
                sortDir
        );

        Page<JournalListItemDTO> result =
                journalQueryService.search(criteria, pageable);

        log.info(
                "Journal paper search completed: returned {} records out of {}",
                result.getNumberOfElements(),
                result.getTotalElements()
        );

        return result;
    }

    @GetMapping("/{id}")
    public JournalListItemDTO getById(@PathVariable Long id) {
        log.trace("Entered getById() for journal paper {}", id);

        JournalListItemDTO result =
                journalQueryService.getById(id);

        log.debug("Successfully retrieved journal paper {}", id);

        return result;
    }

    @GetMapping("/columns")
    public List<ColumnMetaDTO> getColumns() {
        log.trace("Entered getColumns()");

        List<ColumnMetaDTO> columns =
                journalQueryService.getColumns();

        log.debug(
                "Retrieved {} journal column definitions",
                columns.size()
        );

        return columns;
    }

    @GetMapping("/filter-options")
    public JournalFilterOptionsDTO getFilterOptions() {
        log.trace("Entered getFilterOptions()");

        JournalFilterOptionsDTO options =
                journalQueryService.getFilterOptions();

        log.debug("Successfully retrieved journal filter options");

        return options;
    }
}