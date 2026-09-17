package com.nirma.portal.portal_backend.service;

import com.nirma.portal.portal_backend.dto.ExternalFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.ExternalFundedProject;
import com.nirma.portal.portal_backend.mapper.ExternalFundedProjectMapper;
import com.nirma.portal.portal_backend.repository.ExternalFundedProjectRepository;
import com.nirma.portal.portal_backend.exception.DuplicateExternalFundedProjectException;
import com.nirma.portal.portal_backend.exception.ExternalFundedProjectNotFoundException;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
@Slf4j
@Service
public class ExternalFundedProjectService {

    private final ExternalFundedProjectRepository repository;
    private final ExternalFundedProjectMapper mapper;

    public ExternalFundedProjectService(
            ExternalFundedProjectRepository repository,
            ExternalFundedProjectMapper mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    public ExternalFundedProjectResponseDTO createProject(
            ExternalFundedProjectRequestDTO dto) {

        log.trace(
                "Entered createProject() for project '{}'",
                dto.getProjectTitle()
        );

        log.debug(
                "Checking whether external funded project '{}' already exists",
                dto.getProjectTitle()
        );

        if (repository.existsByProjectTitle(
                dto.getProjectTitle())) {

            log.warn(
                    "Duplicate external funded project title '{}'",
                    dto.getProjectTitle()
            );

            throw new DuplicateExternalFundedProjectException(
                    "Project with this title already exists"
            );
        }

        ExternalFundedProject project =
                mapper.toEntity(dto);

        try {

            ExternalFundedProject savedProject =
                    repository.save(project);

            log.info(
                    "Successfully created external funded project '{}' with id {}",
                    savedProject.getProjectTitle(),
                    savedProject.getId()
            );

            return mapper.toResponseDTO(savedProject);

        } catch (Exception e) {

            log.error(
                    "Failed to create external funded project '{}'",
                    dto.getProjectTitle(),
                    e
            );

            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    public List<ExternalFundedProjectResponseDTO> getAllProjects() {

        log.trace("Entered getAllProjects()");

        try {

            List<ExternalFundedProjectResponseDTO> projects =
                    mapper.toResponseDTOList(
                            repository.findAll()
                    );

            log.debug(
                    "Retrieved {} external funded projects",
                    projects.size()
            );

            return projects;

        } catch (Exception e) {

            log.error(
                    "Failed to retrieve all external funded projects",
                    e
            );

            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    public ExternalFundedProjectResponseDTO getProjectById(
            Long id) {

        log.trace(
                "Entered getProjectById() for id {}",
                id
        );

        ExternalFundedProject project =
                repository.findById(id)
                        .orElseThrow(() -> {

                            log.warn(
                                    "External funded project with id {} not found",
                                    id
                            );

                            return new ExternalFundedProjectNotFoundException(
                                    "Project not found with id: " + id
                            );
                        });

        log.debug(
                "Found external funded project '{}' for id {}",
                project.getProjectTitle(),
                id
        );

        return mapper.toResponseDTO(project);
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    public ExternalFundedProjectResponseDTO updateProject(
            Long id,
            ExternalFundedProjectRequestDTO dto) {

        log.trace(
                "Entered updateProject() for id {}",
                id
        );

        ExternalFundedProject existingProject =
                repository.findById(id)
                        .orElseThrow(() -> {

                            log.warn(
                                    "Cannot update external funded project: id {} not found",
                                    id
                            );

                            return new ExternalFundedProjectNotFoundException(
                                    "Project not found with id: " + id
                            );
                        });

        // -----------------------------------------------------
        // CHECK DUPLICATE PROJECT TITLE
        // -----------------------------------------------------

        if (!existingProject
                .getProjectTitle()
                .equals(dto.getProjectTitle())
                && repository.existsByProjectTitle(
                        dto.getProjectTitle())) {

            log.warn(
                    "Cannot update external funded project id {}: " +
                    "duplicate project title '{}'",
                    id,
                    dto.getProjectTitle()
            );

            throw new DuplicateExternalFundedProjectException(
                    "Project with this title already exists"
            );
        }

        // -----------------------------------------------------
        // UPDATE FIELDS
        // -----------------------------------------------------

        existingProject.setProjectTitle(
                dto.getProjectTitle()
        );

        existingProject.setPrincipalInvestigator(
                dto.getPrincipalInvestigator()
        );

        existingProject.setCoPrincipalInvestigatorList(
                dto.getCoPrincipalInvestigatorList()
        );

        existingProject.setFundingAgencyName(
                dto.getFundingAgencyName()
        );

        existingProject.setAmountTotalSanctioned(
                dto.getAmountTotalSanctioned()
        );

        existingProject.setDuration(
                dto.getDuration()
        );

        existingProject.setAcademicYear(
                dto.getAcademicYear()
        );

        existingProject.setFromDate(
                dto.getFromDate()
        );

        existingProject.setToDate(
                dto.getToDate()
        );

        existingProject.setOutcomeOfProject(
                dto.getOutcomeOfProject()
        );

        existingProject.setPublishedPaperDetails(
                dto.getPublishedPaperDetails()
        );

        existingProject.setJointPublicationProof(
                dto.getJointPublicationProof()
        );

        existingProject.setStatusOfTheProject(
                dto.getStatusOfTheProject()
        );

        // -----------------------------------------------------
        // SAVE UPDATED PROJECT
        // -----------------------------------------------------

        try {

            ExternalFundedProject updatedProject =
                    repository.save(existingProject);

            log.info(
                    "Successfully updated external funded project " +
                    "id {} with title '{}'",
                    id,
                    updatedProject.getProjectTitle()
            );

            return mapper.toResponseDTO(updatedProject);

        } catch (Exception e) {

            log.error(
                    "Failed to update external funded project id {}",
                    id,
                    e
            );

            throw e;
        }
    }
    
	// ---------------------------------------------------------
	// FILTER + PAGINATION
	// ---------------------------------------------------------

	 public Page<ExternalFundedProjectResponseDTO> findProjectsWithFilters(
	
	         String projectTitle,
	         String pi,
	         String coPi,
	         String fundingAgencyName,
	
	         Long minAmount,
	         Long maxAmount,
	
	         Long minDuration,
	         Long maxDuration,
	
	         String academicYear,
	
	         String outcome,
	         String status,
	
	         LocalDate dateFrom,
	         LocalDate dateTo,
	
	         int page,
	         int size,
	
	         String sortBy,
	         String direction
	 ) {
	
	     log.trace(
	             "Entered findProjectsWithFilters()"
	     );
	
	     log.debug(
	             "Filtering external funded projects: page={}, size={}, sortBy={}, direction={}",
	             page,
	             size,
	             sortBy,
	             direction
	     );
	
	     // -----------------------------------------------------
	     // SORTING
	     // -----------------------------------------------------
	
	     Sort.Direction sortDirection =
	             "desc".equalsIgnoreCase(direction)
	                     ? Sort.Direction.DESC
	                     : Sort.Direction.ASC;
	
	     Sort sort =
	             Sort.by(sortDirection, sortBy);
	
	     // -----------------------------------------------------
	     // PAGINATION
	     // -----------------------------------------------------
	
	     Pageable pageable =
	             PageRequest.of(
	                     page,
	                     size,
	                     sort
	             );
	
	     try {
	
	         // -------------------------------------------------
	         // DATABASE QUERY
	         // -------------------------------------------------
	
	         Page<ExternalFundedProject> projectPage =
	                 repository.findProjectsWithFilters(
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
	                         pageable
	                 );
	
	         log.info(
	                 "External funded project filter returned {} projects",
	                 projectPage.getTotalElements()
	         );
	
	         // -------------------------------------------------
	         // ENTITY → RESPONSE DTO
	         // -------------------------------------------------
	
	         return projectPage.map(
	                 mapper::toResponseDTO
	         );
	
	     } catch (Exception e) {
	
	         log.error(
	                 "Failed to filter external funded projects",
	                 e
	         );
	
	         throw e;
	     }
	 }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    public void deleteProject(Long id) {

        log.trace(
                "Entered deleteProject() for id {}",
                id
        );

        if (!repository.existsById(id)) {

            log.warn(
                    "Cannot delete external funded project: id {} not found",
                    id
            );

            throw new ExternalFundedProjectNotFoundException(
                    "Project not found with id: " + id
            );
        }

        try {

            repository.deleteById(id);

            log.info(
                    "Successfully deleted external funded project with id {}",
                    id
            );

        } catch (Exception e) {

            log.error(
                    "Failed to delete external funded project with id {}",
                    id,
                    e
            );

            throw e;
        }
    }
}