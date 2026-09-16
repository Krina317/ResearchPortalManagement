package com.nirma.portal.portal_backend.controller;

import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectSummaryDTO;
import com.nirma.portal.portal_backend.service.NuFundedProjectSummaryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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

        log.trace("Entered getAllYearlySummaries()");

        List<NuFundedProjectSummaryDTO> summaries =
                summaryService.getAllYearlySummaries();

        log.info(
                "Retrieved NU funded project summaries for {} academic years",
                summaries.size()
        );

        return ResponseEntity.ok(summaries);
    }

    /*
     * Returns detailed projects sanctioned
     * in a particular academic year.
     */
    @GetMapping("/{academicYear}/projects")
    public ResponseEntity<List<NuFundedProjectResponseDTO>>
    getProjectsSanctionedInYear(
            @PathVariable String academicYear) {

        log.trace(
                "Entered getProjectsSanctionedInYear() for academic year '{}'",
                academicYear
        );

        List<NuFundedProjectResponseDTO> projects =
                summaryService.getProjectsSanctionedInYear(
                        academicYear
                );

        log.info(
                "Retrieved {} NU funded projects sanctioned in academic year '{}'",
                projects.size(),
                academicYear
        );

        return ResponseEntity.ok(projects);
    }
}