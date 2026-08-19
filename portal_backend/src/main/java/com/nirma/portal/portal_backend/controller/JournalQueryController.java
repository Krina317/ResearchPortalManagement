package com.nirma.portal.portal_backend.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ColumnMetaDTO;
import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.service.JournalQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalQueryController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "yearOfPublication");

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
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "yearOfPublication";

        JournalSearchCriteria criteria = new JournalSearchCriteria(
                paperTitle, journalName, journalType, department, instituteName,
                indexIn, issnNo, volumeNo, issueNo, pageNo, doiNumber,
                authorName, authorPosition,
                fromYear, fromMonth, toYear, toMonth,
                academicYear, financialYear, calendarYear
        );
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), safeSortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return journalQueryService.search(criteria, pageable);
    }

    @GetMapping("/{id}")
    public JournalListItemDTO getById(@PathVariable Long id) {
        return journalQueryService.getById(id);
    }

    @GetMapping("/columns")
    public List<ColumnMetaDTO> getColumns() {
        return journalQueryService.getColumns();
    }
}