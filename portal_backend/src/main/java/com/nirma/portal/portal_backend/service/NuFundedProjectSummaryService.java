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

import lombok.extern.slf4j.Slf4j;

@Slf4j
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

        log.trace("Entered getAllYearlySummaries()");

        try {
            List<NuFundedProject> allProjects =
                    repository.findAll();

            log.debug("Retrieved {} NU funded projects for yearly summary calculation",
                    allProjects.size());

            List<String> academicYears =
                    allProjects.stream()
                            .map(NuFundedProject::getAcademicYear)
                            .filter(year -> year != null && !year.isBlank())
                            .distinct()
                            .sorted(Comparator.comparingInt(
                                    this::extractStartingYear
                            ))
                            .toList();

            log.debug("Found {} academic years for summary calculation",
                    academicYears.size());

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

            log.info("Successfully generated yearly summaries for {} academic years",
                    summaries.size());

            return summaries;

        } catch (Exception e) {
            log.error("Failed to generate NU funded project yearly summaries",
                    e);

            throw e;
        }
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

        log.trace("Entered getProjectsSanctionedInYear() for academic year '{}'",
                academicYear);

        try {
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

            log.debug(
                    "Found {} NU funded projects sanctioned in academic year '{}'",
                    projects.size(),
                    academicYear
            );

            return mapper.toResponseDTOList(projects);

        } catch (Exception e) {
            log.error(
                    "Failed to retrieve NU funded projects sanctioned in academic year '{}'",
                    academicYear,
                    e
            );

            throw e;
        }
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