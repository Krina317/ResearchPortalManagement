package com.nirma.portal.portal_backend.controller;

import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectSummaryDTO;
import com.nirma.portal.portal_backend.service.NuFundedProjectSummaryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nu-funded-projects/summary")
public class NuFundedProjectSummaryController {

    private final NuFundedProjectSummaryService summaryService;

    public NuFundedProjectSummaryController(
            NuFundedProjectSummaryService summaryService) {

        this.summaryService = summaryService;
    }

    /*
     * Returns summaries for ALL academic years
     * that exist in the database.
     */
    @GetMapping
    public ResponseEntity<List<NuFundedProjectSummaryDTO>>
    getAllYearlySummaries() {

        return ResponseEntity.ok(
                summaryService.getAllYearlySummaries()
        );
    }

    /*
     * Returns detailed projects sanctioned
     * in a particular academic year.
     */
    @GetMapping("/{academicYear}/projects")
    public ResponseEntity<List<NuFundedProjectResponseDTO>>
    getProjectsSanctionedInYear(
            @PathVariable String academicYear) {

        return ResponseEntity.ok(
                summaryService.getProjectsSanctionedInYear(
                        academicYear
                )
        );
    }
}