package com.nirma.portal.portal_backend.service;

import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectSummaryDTO;
import com.nirma.portal.portal_backend.entity.NuFundedProject;
import com.nirma.portal.portal_backend.mapper.NuFundedProjectMapper;
import com.nirma.portal.portal_backend.repository.NuFundedProjectRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class NuFundedProjectSummaryService {

    private final NuFundedProjectRepository repository;
    private final NuFundedProjectMapper mapper;

    public NuFundedProjectSummaryService(
            NuFundedProjectRepository repository,
            NuFundedProjectMapper mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }

    /*
     * Returns summary for ALL academic years
     * that actually exist in the database.
     */
    public List<NuFundedProjectSummaryDTO> getAllYearlySummaries() {

        List<NuFundedProject> allProjects =
                repository.findAll();

        List<String> academicYears =
                allProjects.stream()
                        .map(NuFundedProject::getAcademicYear)
                        .filter(year -> year != null && !year.isBlank())
                        .distinct()
                        .sorted(Comparator.comparingInt(
                                this::extractStartingYear
                        ))
                        .toList();

        List<NuFundedProjectSummaryDTO> summaries =
                new ArrayList<>();

        for (String academicYear : academicYears) {

            summaries.add(
                    calculateYearlySummary(
                            allProjects,
                            academicYear
                    )
            );
        }

        return summaries;
    }

    private NuFundedProjectSummaryDTO calculateYearlySummary(
            List<NuFundedProject> allProjects,
            String academicYear) {

        long totalProjects = 0;
        long sanctionedProjects = 0;
        long sanctionedAmount = 0;

        for (NuFundedProject project : allProjects) {

            /*
             * Total Projects:
             * Count projects that are running
             * during this academic year.
             */
            if (isProjectRunningInAcademicYear(
                    project.getAcademicYear(),
                    project.getDuration(),
                    academicYear)) {

                totalProjects++;
            }

            /*
             * Sanctioned Projects:
             * Count ONLY projects that started
             * in this academic year.
             */
            if (academicYear.equals(
                    project.getAcademicYear())) {

                sanctionedProjects++;

                if (project.getAmount() != null) {
                    sanctionedAmount += project.getAmount();
                }
            }
        }

        return new NuFundedProjectSummaryDTO(
                academicYear,
                totalProjects,
                sanctionedProjects,
                sanctionedAmount
        );
    }

    public List<NuFundedProjectResponseDTO>
    getProjectsSanctionedInYear(
            String academicYear) {

        List<NuFundedProject> projects =
                repository.findAll()
                        .stream()
                        .filter(project ->
                                academicYear.equals(
                                        project.getAcademicYear()
                                )
                        )
                        .sorted(
                                Comparator.comparing(
                                        NuFundedProject::getId
                                )
                        )
                        .toList();

        return mapper.toResponseDTOList(projects);
    }

    private boolean isProjectRunningInAcademicYear(
            String projectStartAcademicYear,
            Long duration,
            String requestedAcademicYear) {

        if (projectStartAcademicYear == null
                || duration == null
                || duration <= 0) {

            return false;
        }

        int startYear =
                extractStartingYear(
                        projectStartAcademicYear
                );

        int requestedYear =
                extractStartingYear(
                        requestedAcademicYear
                );

        int lastYear =
                startYear + duration.intValue() - 1;

        return requestedYear >= startYear
                && requestedYear <= lastYear;
    }

    private int extractStartingYear(
            String academicYear) {

        if (academicYear == null
                || academicYear.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid academic year"
            );
        }

        String[] parts =
                academicYear.trim().split("-");

        if (parts.length != 2) {

            throw new IllegalArgumentException(
                    "Academic year must be in format YYYY-YYYY"
            );
        }

        try {
            return Integer.parseInt(parts[0]);

        } catch (NumberFormatException e) {

            throw new IllegalArgumentException(
                    "Invalid academic year: "
                            + academicYear
            );
        }
    }
}