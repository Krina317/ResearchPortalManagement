package com.nirma.portal.portal_backend.controller;

import com.nirma.portal.portal_backend.dto.ExternalFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.service.ExternalFundedProjectService;

import jakarta.validation.Valid;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.time.LocalDate;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/external-funded-projects")
public class ExternalFundedProjectController {

    private final ExternalFundedProjectService service;

    public ExternalFundedProjectController(
            ExternalFundedProjectService service) {

        this.service = service;
    }

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    @PostMapping
    public ResponseEntity<ExternalFundedProjectResponseDTO> createProject(
            @Valid @RequestBody ExternalFundedProjectRequestDTO dto) {

        log.trace(
                "Entered createProject() controller for project '{}'",
                dto.getProjectTitle()
        );

        log.debug(
                "Creating external funded project '{}'",
                dto.getProjectTitle()
        );

        ExternalFundedProjectResponseDTO createdProject =
                service.createProject(dto);

        log.info(
                "External funded project '{}' created successfully",
                createdProject.getProjectTitle()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdProject);
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<ExternalFundedProjectResponseDTO>>
    getAllProjects() {

        log.trace("Entered getAllProjects() controller");

        List<ExternalFundedProjectResponseDTO> projects =
                service.getAllProjects();

        log.debug(
                "Returning {} external funded projects",
                projects.size()
        );

        return ResponseEntity.ok(projects);
    }
    
	 // ---------------------------------------------------------
	 // FILTER + PAGINATION
	 // ---------------------------------------------------------
	
	 @GetMapping("/filter")
	 public ResponseEntity<Page<ExternalFundedProjectResponseDTO>>
	 findProjectsWithFilters(
	
	         @RequestParam(required = false)
	         String projectTitle,
	
	         @RequestParam(required = false)
	         String pi,
	
	         @RequestParam(required = false)
	         String coPi,
	
	         @RequestParam(required = false)
	         String fundingAgencyName,
	
	         @RequestParam(required = false)
	         Long minAmount,
	
	         @RequestParam(required = false)
	         Long maxAmount,
	
	         @RequestParam(required = false)
	         Long minDuration,
	
	         @RequestParam(required = false)
	         Long maxDuration,
	
	         @RequestParam(required = false)
	         String academicYear,
	
	         @RequestParam(required = false)
	         String outcome,
	
	         @RequestParam(required = false)
	         String status,
	
	         @RequestParam(required = false)
	         LocalDate dateFrom,
	
	         @RequestParam(required = false)
	         LocalDate dateTo,
	
	         @RequestParam(defaultValue = "0")
	         int page,
	
	         @RequestParam(defaultValue = "10")
	         int size,
	
	         @RequestParam(defaultValue = "id")
	         String sortBy,
	
	         @RequestParam(defaultValue = "asc")
	         String direction
	 ) {
	
	     log.trace(
	             "Entered findProjectsWithFilters() controller"
	     );
	
	     log.debug(
	             "Filtering external funded projects: page={}, size={}, sortBy={}, direction={}",
	             page,
	             size,
	             sortBy,
	             direction
	     );
	
	     Page<ExternalFundedProjectResponseDTO> projects =
	             service.findProjectsWithFilters(
	                     projectTitle,
	                     pi,
	                     coPi,
	                     fundingAgencyName,
	                     minAmount,
	                     maxAmount,
	                     minDuration,
	                     maxDuration,
	                     academicYear,
	                     outcome,
	                     status,
	                     dateFrom,
	                     dateTo,
	                     page,
	                     size,
	                     sortBy,
	                     direction
	             );
	
	     log.info(
	             "External funded project filter returned {} projects",
	             projects.getTotalElements()
	     );
	
	     return ResponseEntity.ok(projects);
	 }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ExternalFundedProjectResponseDTO>
    getProjectById(
            @PathVariable Long id) {

        log.trace(
                "Entered getProjectById() controller for id {}",
                id
        );

        ExternalFundedProjectResponseDTO project =
                service.getProjectById(id);

        log.debug(
                "Returning external funded project id {}",
                id
        );

        return ResponseEntity.ok(project);
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<ExternalFundedProjectResponseDTO>
    updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ExternalFundedProjectRequestDTO dto) {

        log.trace(
                "Entered updateProject() controller for id {}",
                id
        );

        log.debug(
                "Updating external funded project id {}",
                id
        );

        ExternalFundedProjectResponseDTO updatedProject =
                service.updateProject(id, dto);

        log.info(
                "External funded project id {} updated successfully",
                id
        );

        return ResponseEntity.ok(updatedProject);
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        log.trace(
                "Entered deleteProject() controller for id {}",
                id
        );

        log.debug(
                "Deleting external funded project id {}",
                id
        );

        service.deleteProject(id);

        log.info(
                "External funded project id {} deleted successfully",
                id
        );

        return ResponseEntity.noContent().build();
    }
}