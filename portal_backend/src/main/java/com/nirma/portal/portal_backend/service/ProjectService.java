package com.nirma.portal.portal_backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.ExternalFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.ProjectType;
import com.nirma.portal.portal_backend.entity.Projects;
import com.nirma.portal.portal_backend.exception.DuplicateExternalFundedProjectException;
import com.nirma.portal.portal_backend.exception.DuplicateNuFundedProjectException;
import com.nirma.portal.portal_backend.exception.ExternalFundedProjectNotFoundException;
import com.nirma.portal.portal_backend.exception.NuFundedProjectNotFoundException;
import com.nirma.portal.portal_backend.mapper.ExternalFundedProjectMapper;
import com.nirma.portal.portal_backend.mapper.NuFundedProjectMapper;
import com.nirma.portal.portal_backend.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;
    private final NuFundedProjectMapper nuMapper;
    private final ExternalFundedProjectMapper externalMapper;

    // =========================================================
    //                    NU FUNDED PROJECTS
    // =========================================================

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public NuFundedProjectResponseDTO createNuProject(NuFundedProjectRequestDTO dto) {

        log.trace("Entered createNuProject() for project '{}'", dto.getProjectTitle());
        log.debug("Checking whether project '{}' already exists", dto.getProjectTitle());

        if (repository.existsByProjectTitle(dto.getProjectTitle())) {
            log.warn("Duplicate NU funded project title '{}'", dto.getProjectTitle());
            throw new DuplicateNuFundedProjectException("Project with this title already exists");
        }

        Projects project = nuMapper.toEntity(dto);

        try {
            Projects savedProject = repository.save(project);
            log.info("Successfully created NU funded project '{}' with id {}",
                    savedProject.getProjectTitle(), savedProject.getId());
            return nuMapper.toResponseDTO(savedProject);
        } catch (Exception e) {
            log.error("Failed to create NU funded project '{}'", dto.getProjectTitle(), e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<NuFundedProjectResponseDTO> getAllNuProjects() {

        log.trace("Entered getAllNuProjects()");

        try {
            List<NuFundedProjectResponseDTO> projects = nuMapper.toResponseDTOList(
                    repository.findByProjectType(ProjectType.NuFundedProject));

            log.debug("Retrieved {} NU funded projects", projects.size());
            return projects;
        } catch (Exception e) {
            log.error("Failed to retrieve all NU funded projects", e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public NuFundedProjectResponseDTO getNuProjectById(Long id) {

        log.trace("Entered getNuProjectById() for id {}", id);

        Projects project = findNuProjectOrThrow(id, "get");

        log.debug("Found NU funded project '{}' for id {}", project.getProjectTitle(), id);
        return nuMapper.toResponseDTO(project);
    }

    // ---------------------------------------------------------
    // FILTER + PAGINATION + SORTING
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<NuFundedProjectResponseDTO> getNuProjectsWithFilters(
            String pi,
            String coPi,
            Long minAmount,
            Long maxAmount,
            String projectCategory,
            Long minDuration,
            Long maxDuration,
            String academicYear,
            String outcome,
            Pageable pageable) {

        log.trace("Entered getNuProjectsWithFilters()");
        log.debug("Applying NU project filters: pi='{}', coPi='{}', minAmount={}, maxAmount={}, "
                + "category='{}', minDuration={}, maxDuration={}, academicYear='{}', outcome='{}'",
                pi, coPi, minAmount, maxAmount, projectCategory,
                minDuration, maxDuration, academicYear, outcome);

        Page<Projects> projects = repository.findNuProjectsWithFilters(
                pi, coPi, minAmount, maxAmount, projectCategory,
                minDuration, maxDuration, academicYear, outcome, pageable);

        return projects.map(nuMapper::toResponseDTO);
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public NuFundedProjectResponseDTO updateNuProject(Long id, NuFundedProjectRequestDTO dto) {

        log.trace("Entered updateNuProject() for id {}", id);

        Projects existingProject = findNuProjectOrThrow(id, "update");

        // Check duplicate project title only if the title is actually being changed
        if (!existingProject.getProjectTitle().equals(dto.getProjectTitle())
                && repository.existsByProjectTitle(dto.getProjectTitle())) {

            log.warn("Cannot update NU funded project id {}: duplicate project title '{}'",
                    id, dto.getProjectTitle());
            throw new DuplicateNuFundedProjectException("Project with this title already exists");
        }

        nuMapper.updateEntity(existingProject, dto);

        try {
            Projects updatedProject = repository.save(existingProject);
            log.info("Successfully updated NU funded project id {} with title '{}'",
                    id, updatedProject.getProjectTitle());
            return nuMapper.toResponseDTO(updatedProject);
        } catch (Exception e) {
            log.error("Failed to update NU funded project id {}", id, e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public void deleteNuProject(Long id) {

        log.trace("Entered deleteNuProject() for id {}", id);

        Projects project = findNuProjectOrThrow(id, "delete");

        try {
            repository.delete(project);
            log.info("Successfully deleted NU funded project with id {}", id);
        } catch (Exception e) {
            log.error("Failed to delete NU funded project with id {}", id, e);
            throw e;
        }
    }

    // =========================================================
    //                 EXTERNAL FUNDED PROJECTS
    // =========================================================

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public ExternalFundedProjectResponseDTO createExternalProject(ExternalFundedProjectRequestDTO dto) {

        log.trace("Entered createExternalProject() for project '{}'", dto.getProjectTitle());
        log.debug("Checking whether external funded project '{}' already exists", dto.getProjectTitle());

        if (repository.existsByProjectTitle(dto.getProjectTitle())) {
            log.warn("Duplicate external funded project title '{}'", dto.getProjectTitle());
            throw new DuplicateExternalFundedProjectException("Project with this title already exists");
        }

        Projects project = externalMapper.toEntity(dto);

        try {
            Projects savedProject = repository.save(project);
            log.info("Successfully created external funded project '{}' with id {}",
                    savedProject.getProjectTitle(), savedProject.getId());
            return externalMapper.toResponseDTO(savedProject);
        } catch (Exception e) {
            log.error("Failed to create external funded project '{}'", dto.getProjectTitle(), e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<ExternalFundedProjectResponseDTO> getAllExternalProjects() {

        log.trace("Entered getAllExternalProjects()");

        try {
            List<ExternalFundedProjectResponseDTO> projects = externalMapper.toResponseDTOList(
                    repository.findByProjectType(ProjectType.ExternalFundedProject));

            log.debug("Retrieved {} external funded projects", projects.size());
            return projects;
        } catch (Exception e) {
            log.error("Failed to retrieve all external funded projects", e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public ExternalFundedProjectResponseDTO getExternalProjectById(Long id) {

        log.trace("Entered getExternalProjectById() for id {}", id);

        Projects project = findExternalProjectOrThrow(id, "get");

        log.debug("Found external funded project '{}' for id {}", project.getProjectTitle(), id);
        return externalMapper.toResponseDTO(project);
    }

    // ---------------------------------------------------------
    // FILTER + PAGINATION
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<ExternalFundedProjectResponseDTO> findExternalProjectsWithFilters(
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
            String direction) {

        log.trace("Entered findExternalProjectsWithFilters()");
        log.debug("Filtering external funded projects: page={}, size={}, sortBy={}, direction={}",
                page, size, sortBy, direction);

        // SORTING
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sort = Sort.by(sortDirection, sortBy);

        // PAGINATION
        Pageable pageable = PageRequest.of(page, size, sort);

        try {
            // DATABASE QUERY
            Page<Projects> projectPage = repository.findExternalProjectsWithFilters(
                    projectTitle, pi, coPi, fundingAgencyName,
                    minAmount, maxAmount, minDuration, maxDuration,
                    academicYear, outcome, status, dateFrom, dateTo, pageable);

            log.info("External funded project filter returned {} projects",
                    projectPage.getTotalElements());

            // ENTITY -> RESPONSE DTO
            return projectPage.map(externalMapper::toResponseDTO);
        } catch (Exception e) {
            log.error("Failed to filter external funded projects", e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public ExternalFundedProjectResponseDTO updateExternalProject(
            Long id, ExternalFundedProjectRequestDTO dto) {

        log.trace("Entered updateExternalProject() for id {}", id);

        Projects existingProject = findExternalProjectOrThrow(id, "update");

        // Check duplicate project title only if the title is actually being changed
        if (!existingProject.getProjectTitle().equals(dto.getProjectTitle())
                && repository.existsByProjectTitle(dto.getProjectTitle())) {

            log.warn("Cannot update external funded project id {}: duplicate project title '{}'",
                    id, dto.getProjectTitle());
            throw new DuplicateExternalFundedProjectException("Project with this title already exists");
        }

        externalMapper.updateEntity(existingProject, dto);

        try {
            Projects updatedProject = repository.save(existingProject);
            log.info("Successfully updated external funded project id {} with title '{}'",
                    id, updatedProject.getProjectTitle());
            return externalMapper.toResponseDTO(updatedProject);
        } catch (Exception e) {
            log.error("Failed to update external funded project id {}", id, e);
            throw e;
        }
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    @Transactional
    public void deleteExternalProject(Long id) {

        log.trace("Entered deleteExternalProject() for id {}", id);

        Projects project = findExternalProjectOrThrow(id, "delete");

        try {
            repository.delete(project);
            log.info("Successfully deleted external funded project with id {}", id);
        } catch (Exception e) {
            log.error("Failed to delete external funded project with id {}", id, e);
            throw e;
        }
    }

    // =========================================================
    //                        HELPERS
    // =========================================================

    // Looks up by id AND type, so a Nu endpoint can never touch an external project
    private Projects findNuProjectOrThrow(Long id, String action) {
        return repository.findByIdAndProjectType(id, ProjectType.NuFundedProject)
                .orElseThrow(() -> {
                    log.warn("Cannot {} NU funded project: id {} not found", action, id);
                    return new NuFundedProjectNotFoundException("Project not found with id: " + id);
                });
    }

    private Projects findExternalProjectOrThrow(Long id, String action) {
        return repository.findByIdAndProjectType(id, ProjectType.ExternalFundedProject)
                .orElseThrow(() -> {
                    log.warn("Cannot {} external funded project: id {} not found", action, id);
                    return new ExternalFundedProjectNotFoundException("Project not found with id: " + id);
                });
    }
}