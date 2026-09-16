package com.nirma.portal.portal_backend.service;

import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.NuFundedProject;
import com.nirma.portal.portal_backend.mapper.NuFundedProjectMapper;
import com.nirma.portal.portal_backend.repository.NuFundedProjectRepository;
import com.nirma.portal.portal_backend.exception.DuplicateNuFundedProjectException;
import com.nirma.portal.portal_backend.exception.NuFundedProjectNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;



import java.util.List;

@Slf4j
@Service
public class NuFundedProjectService {

    private final NuFundedProjectRepository repository;
    private final NuFundedProjectMapper mapper;


    public NuFundedProjectService(
            NuFundedProjectRepository repository,
            NuFundedProjectMapper mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }

    // ---------------------------------------------------------
    // CREATE PROJECT
    // ---------------------------------------------------------

    public NuFundedProjectResponseDTO createProject(
            NuFundedProjectRequestDTO dto) {
    	log.trace("Entered createProject() for project '{}'",
                 dto.getProjectTitle());

        log.debug("Checking whether project '{}' already exists",
                 dto.getProjectTitle());


        if (repository.existsByProjectTitle(
                dto.getProjectTitle())) {
        	log.warn("Duplicate NU funded project title '{}'",
                     dto.getProjectTitle());

            throw new DuplicateNuFundedProjectException(
                    "Project with this title already exists"
            );
        }

        NuFundedProject project = mapper.toEntity(dto);
        
        try {
        	 NuFundedProject savedProject = repository.save(project);
        	 log.info("Succesfully created NU funded project '{}'");
        	 return mapper.toResponseDTO(savedProject);
        }
        catch(Exception e) {
        	log.error("Failed to create NU funded project '{}'",
                    dto.getProjectTitle(), e);

            throw e;
        }

    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    public List<NuFundedProjectResponseDTO> getAllProjects() {
    	log.trace("Entered getAllProjects()");
        try {
            List<NuFundedProjectResponseDTO> projects =
                    mapper.toResponseDTOList(
                            repository.findAll()
                    );

            log.debug("Retrieved {} NU funded projects",
                    projects.size());

            return projects;

        } catch (Exception e) {
            log.error("Failed to retrieve all NU funded projects", e);

            throw e;
        }
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    public NuFundedProjectResponseDTO getProjectById(
            Long id) {
    	log.trace("Entered getProjectById() for id {}", id);
        NuFundedProject project =
                repository.findById(id)
                        .orElseThrow(() -> {
                            log.warn("NU funded project with id {} not found",
                                    id);

                            return new NuFundedProjectNotFoundException(
                                    "Project not found with id: " + id
                            );
                        });
        log.debug("Found NU funded project '{}' for id {}",
                project.getProjectTitle(), id);
        
        return mapper.toResponseDTO(project);
    }

    // ---------------------------------------------------------
    // FILTER + PAGINATION + SORTING
    // ---------------------------------------------------------

    public Page<NuFundedProjectResponseDTO>
    getProjectsWithFilters(
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

        Page<NuFundedProject> projects =
                repository.findProjectsWithFilters(
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
        log.trace("Entered getProjectsWithFilters()");
        log.debug(
                "Applying project filters: pi='{}', coPi='{}', minAmount={}, maxAmount={}, " +
                "category='{}', minDuration={}, maxDuration={}, academicYear='{}', outcome='{}'",
                pi,
                coPi,
                minAmount,
                maxAmount,
                projectCategory,
                minDuration,
                maxDuration,
                academicYear,
                outcome
        );
        

        return projects.map(
                mapper::toResponseDTO
        );
    }

    // ---------------------------------------------------------
    // UPDATE PROJECT
    // ---------------------------------------------------------

    public NuFundedProjectResponseDTO updateProject(
            Long id,
            NuFundedProjectRequestDTO dto) {
    	log.trace("Entered updateProject() for id {}", id);
        NuFundedProject existingProject =
                repository.findById(id)
                        .orElseThrow(() -> {
                            log.warn("Cannot update NU funded project: id {} not found",
                                    id);

                            return new NuFundedProjectNotFoundException(
                                    "Project not found with id: " + id
                            );
                        });
        // Check duplicate project title
        // only if the title is actually being changed
        if (!existingProject
                .getProjectTitle()
                .equals(dto.getProjectTitle())
                && repository.existsByProjectTitle(
                        dto.getProjectTitle())) {
        	 log.warn(
                     "Cannot update NU funded project id {}: duplicate project title '{}'",
                     id,
                     dto.getProjectTitle()
             );

            throw new DuplicateNuFundedProjectException(
                    "Project with this title already exists"
            );
        }

        existingProject.setProjectTitle(
                dto.getProjectTitle()
        );

        existingProject.setPrincipalInvestigator(
                dto.getPrincipalInvestigator()
        );

        existingProject.setCoPrincipalInvestigatorList(
                dto.getCoPrincipalInvestigatorList()
        );

        existingProject.setAmount(
                dto.getAmount()
        );

        existingProject.setProjectCategory(
                dto.getProjectCategory()
        );

        existingProject.setDuration(
                dto.getDuration()
        );

        // Academic Year
        existingProject.setAcademicYear(
                dto.getAcademicYear()
        );

        existingProject.setOutcomeOfResearchProject(
                dto.getOutcomeOfResearchProject()
        );

        existingProject.setPublishedPaperDetails(
                dto.getPublishedPaperDetails()
        );

        existingProject.setJointPublicationProof(
                dto.getJointPublicationProof()
        );

        existingProject.setUgStudentDetailList(
                dto.getUgStudentDetailList()
        );

        try {
            NuFundedProject updatedProject =
                    repository.save(existingProject);

            log.info(
                    "Successfully updated NU funded project id {} with title '{}'",
                    id,
                    updatedProject.getProjectTitle()
            );

            return mapper.toResponseDTO(updatedProject);

        } catch (Exception e) {
            log.error("Failed to update NU funded project id {}",
                    id, e);

            throw e;
        }
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    public void deleteProject(Long id) {
    	log.trace("Entered deleteProject() for id {}", id);

        if (!repository.existsById(id)) {
            log.warn("Cannot delete NU funded project: id {} not found",
                    id);
            
            throw new NuFundedProjectNotFoundException(
                    "Project not found with id: " + id
            );
        }

        try {
            repository.deleteById(id);

            log.info("Successfully deleted NU funded project with id {}",
                    id);

        } catch (Exception e) {
            log.error("Failed to delete NU funded project with id {}",
                    id, e);

            throw e;
        }
    }
}