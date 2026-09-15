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

import java.util.List;

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

        if (repository.existsByProjectTitle(
                dto.getProjectTitle())) {

            throw new DuplicateNuFundedProjectException(
                    "Project with this title already exists"
            );
        }

        NuFundedProject project =
                mapper.toEntity(dto);

        NuFundedProject savedProject =
                repository.save(project);

        return mapper.toResponseDTO(savedProject);
    }

    // ---------------------------------------------------------
    // GET ALL PROJECTS
    // ---------------------------------------------------------

    public List<NuFundedProjectResponseDTO> getAllProjects() {

        return mapper.toResponseDTOList(
                repository.findAll()
        );
    }

    // ---------------------------------------------------------
    // GET PROJECT BY ID
    // ---------------------------------------------------------

    public NuFundedProjectResponseDTO getProjectById(
            Long id) {

        NuFundedProject project =
                repository.findById(id)
                        .orElseThrow(() ->
                                new NuFundedProjectNotFoundException(
                                        "Project not found with id: " + id
                                )
                        );

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

        NuFundedProject existingProject =
                repository.findById(id)
                        .orElseThrow(() ->
                                new NuFundedProjectNotFoundException(
                                        "Project not found with id: " + id
                                )
                        );

        // Check duplicate project title
        // only if the title is actually being changed
        if (!existingProject
                .getProjectTitle()
                .equals(dto.getProjectTitle())
                && repository.existsByProjectTitle(
                        dto.getProjectTitle())) {

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

        NuFundedProject updatedProject =
                repository.save(existingProject);

        return mapper.toResponseDTO(updatedProject);
    }

    // ---------------------------------------------------------
    // DELETE PROJECT
    // ---------------------------------------------------------

    public void deleteProject(Long id) {

        if (!repository.existsById(id)) {

            throw new NuFundedProjectNotFoundException(
                    "Project not found with id: " + id
            );
        }

        repository.deleteById(id);
    }
}