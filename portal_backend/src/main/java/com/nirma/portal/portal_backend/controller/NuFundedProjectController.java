package com.nirma.portal.portal_backend.controller;

import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.service.NuFundedProjectService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/nu-funded-projects")
public class NuFundedProjectController {

    private final NuFundedProjectService service;

    public NuFundedProjectController(
            NuFundedProjectService service) {

        this.service = service;
    }

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    @PostMapping
    public ResponseEntity<NuFundedProjectResponseDTO> createProject(
            @Valid @RequestBody NuFundedProjectRequestDTO dto) {

        log.trace("Entered createProject()");

        NuFundedProjectResponseDTO result = service.createProject(dto);

        log.info("NU funded project created successfully");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<NuFundedProjectResponseDTO>> getAllProjects() {

        log.trace("Entered getAllProjects()");

        List<NuFundedProjectResponseDTO> projects =
                service.getAllProjects();

        log.debug("Retrieved {} NU funded projects", projects.size());

        return ResponseEntity.ok(projects);
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<NuFundedProjectResponseDTO> getProjectById(
            @PathVariable Long id) {

        log.trace("Entered getProjectById() for project {}", id);

        NuFundedProjectResponseDTO project =
                service.getProjectById(id);

        log.debug("Successfully retrieved NU funded project {}", id);

        return ResponseEntity.ok(project);
    }

    // ---------------------------------------------------------
    // FILTER + PAGINATION + SORTING
    // ---------------------------------------------------------

    @GetMapping("/filter")
    public ResponseEntity<Page<NuFundedProjectResponseDTO>> getProjectsWithFilters(

            @RequestParam(required = false) String pi,

            @RequestParam(required = false) String coPi,

            @RequestParam(required = false) Long minAmount,

            @RequestParam(required = false) Long maxAmount,

            @RequestParam(required = false) String projectCategory,

            @RequestParam(required = false) Long minDuration,

            @RequestParam(required = false) Long maxDuration,

            @RequestParam(required = false) String academicYear,

            @RequestParam(required = false) String outcome,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "id") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        log.trace("Entered getProjectsWithFilters()");

        log.debug(
                "Filtering NU funded projects: page={}, size={}, sortBy={}, direction={}",
                page, size, sortBy, direction
        );

        // Only Sr. No. (id) and Amount can be sorted
        if (!sortBy.equals("id")
                && !sortBy.equals("amount")) {

            log.warn(
                    "Invalid NU funded project sort field '{}', defaulting to 'id'",
                    sortBy
            );

            sortBy = "id";
        }

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        Page<NuFundedProjectResponseDTO> result =
                service.getProjectsWithFilters(
                        pi,
                        coPi,
                        minAmount,
                        maxAmount,
                        projectCategory,
                        minDuration,
                        maxDuration,
                        academicYear,
                        outcome,
                        pageable
                );

        log.info(
                "NU funded project filter completed: returned {} records out of {}",
                result.getNumberOfElements(),
                result.getTotalElements()
        );

        return ResponseEntity.ok(result);
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<NuFundedProjectResponseDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody NuFundedProjectRequestDTO dto) {

        log.trace("Entered updateProject() for project {}", id);

        NuFundedProjectResponseDTO result =
                service.updateProject(id, dto);

        log.info("NU funded project {} updated successfully", id);

        return ResponseEntity.ok(result);
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        log.trace("Entered deleteProject() for project {}", id);

        service.deleteProject(id);

        log.info("NU funded project {} deleted successfully", id);

        return ResponseEntity.noContent().build();
    }
}