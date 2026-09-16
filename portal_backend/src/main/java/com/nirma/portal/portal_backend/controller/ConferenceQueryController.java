package com.nirma.portal.portal_backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.ConferenceFilterOptionsDTO;
import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.service.ConferenceQueryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceQueryController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("id", "fromDate", "toDate");

    private final ConferenceQueryService conferenceQueryService;

    @GetMapping
    public Page<ConferenceListItemDTO> search(
            @RequestParam(required = false) String conferenceName,
            @RequestParam(required = false) String paperTitle,
            @RequestParam(required = false) String conferenceType,
            @RequestParam(required = false) List<String> department,
            @RequestParam(required = false) String instituteName,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) List<Integer> authorPosition,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Integer academicYear,
            @RequestParam(required = false) Integer financialYear,
            @RequestParam(required = false) Integer calendarYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "fromDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        log.trace("Entered conference search()");

        String safeSortBy =
                ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "fromDate";

        if (!safeSortBy.equals(sortBy)) {
            log.warn("Invalid conference sort field '{}', defaulting to '{}'",
                    sortBy, safeSortBy);
        }

        ConferenceSearchCriteria criteria = new ConferenceSearchCriteria(
                conferenceName,
                paperTitle,
                conferenceType,
                department,
                instituteName,
                authorName,
                authorPosition,
                fromDate,
                toDate,
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
                "Searching conference papers: page={}, size={}, sortBy={}, sortDir={}",
                page, size, safeSortBy, sortDir
        );

        Page<ConferenceListItemDTO> result =
                conferenceQueryService.search(criteria, pageable);

        log.info(
                "Conference paper search completed: returned {} records out of {}",
                result.getNumberOfElements(),
                result.getTotalElements()
        );

        return result;
    }

    @GetMapping("/{id}")
    public ConferenceListItemDTO getById(@PathVariable Long id) {
        log.trace("Entered getById() for conference paper {}", id);

        ConferenceListItemDTO result =
                conferenceQueryService.getById(id);

        log.debug("Successfully retrieved conference paper {}", id);

        return result;
    }

    @GetMapping("/columns")
    public List<ColumnMetaDTO> getColumns() {
        log.trace("Entered getColumns()");

        List<ColumnMetaDTO> columns =
                conferenceQueryService.getColumns();

        log.debug("Retrieved {} conference column definitions",
                columns.size());

        return columns;
    }

    @GetMapping("/filter-options")
    public ConferenceFilterOptionsDTO getFilterOptions() {
        log.trace("Entered getFilterOptions()");

        ConferenceFilterOptionsDTO options =
                conferenceQueryService.getFilterOptions();

        log.debug("Successfully retrieved conference filter options");

        return options;
    }
}