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

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createProject(dto));
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<NuFundedProjectResponseDTO>> getAllProjects() {

        return ResponseEntity.ok(
                service.getAllProjects()
        );
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<NuFundedProjectResponseDTO> getProjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getProjectById(id)
        );
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

        // Only Sr. No. (id) and Amount can be sorted
        if (!sortBy.equals("id")
                && !sortBy.equals("amount")) {

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

        return ResponseEntity.ok(
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
                )
        );
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<NuFundedProjectResponseDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody NuFundedProjectRequestDTO dto) {

        return ResponseEntity.ok(
                service.updateProject(id, dto)
        );
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        service.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}