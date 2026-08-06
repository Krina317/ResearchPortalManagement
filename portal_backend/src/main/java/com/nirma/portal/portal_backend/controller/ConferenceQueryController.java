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
import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.service.ConferenceQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceQueryController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "fromDate", "toDate");

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
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Integer academicYear,
            @RequestParam(required = false) Integer financialYear,
            @RequestParam(required = false) Integer calendarYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "fromDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "fromDate";

        ConferenceSearchCriteria criteria = new ConferenceSearchCriteria(
                conferenceName, paperTitle, conferenceType, department, instituteName,
                authorName, authorPosition, fromDate, toDate, academicYear, financialYear, calendarYear
        );
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), safeSortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return conferenceQueryService.search(criteria, pageable);
    }

    @GetMapping("/{id}")
    public ConferenceListItemDTO getById(@PathVariable Long id) {
        return conferenceQueryService.getById(id);
    }

    @GetMapping("/columns")
    public List<ColumnMetaDTO> getColumns() {
        return conferenceQueryService.getColumns();
    }
}