package com.nirma.portal.portal_backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.entity.ProjectType;
import com.nirma.portal.portal_backend.entity.Projects;

public interface ProjectRepository extends JpaRepository<Projects, Long> {

    boolean existsByProjectTitle(String projectTitle);

    List<Projects> findByProjectType(ProjectType projectType);

    Optional<Projects> findByIdAndProjectType(Long id, ProjectType projectType);

    // ---------------------------------------------------------
    // NU FUNDED FILTER
    // ---------------------------------------------------------

    @Query("""
        SELECT p
        FROM Projects p
        WHERE
            p.projectType = com.nirma.portal.portal_backend.entity.ProjectType.NuFundedProject

            AND
            (:pi IS NULL OR :pi = ''
                OR LOWER(p.principalInvestigator)
                LIKE LOWER(CONCAT('%', :pi, '%')))

            AND
            (:coPi IS NULL OR :coPi = ''
                OR LOWER(p.coPrincipalInvestigatorList)
                LIKE LOWER(CONCAT('%', :coPi, '%')))

            AND
            (:minAmount IS NULL
                OR p.amount >= :minAmount)

            AND
            (:maxAmount IS NULL
                OR p.amount <= :maxAmount)

            AND
            (:projectCategory IS NULL OR :projectCategory = ''
                OR p.nuProjectCategory = :projectCategory)

            AND
            (:minDuration IS NULL
                OR p.duration >= :minDuration)

            AND
            (:maxDuration IS NULL
                OR p.duration <= :maxDuration)

            AND
            (:academicYear IS NULL OR :academicYear = ''
                OR p.academicYear = :academicYear)

            AND
            (:outcome IS NULL OR :outcome = ''
                OR LOWER(p.outcomeOfProject)
                LIKE LOWER(CONCAT('%', :outcome, '%')))
        """)
    Page<Projects> findNuProjectsWithFilters(
            @Param("pi") String pi,
            @Param("coPi") String coPi,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("projectCategory") String projectCategory,
            @Param("minDuration") Long minDuration,
            @Param("maxDuration") Long maxDuration,
            @Param("academicYear") String academicYear,
            @Param("outcome") String outcome,
            Pageable pageable
    );

    // ---------------------------------------------------------
    // EXTERNAL FUNDED FILTER
    // ---------------------------------------------------------

    @Query("""
        SELECT p
        FROM Projects p
        WHERE
            p.projectType = com.nirma.portal.portal_backend.entity.ProjectType.ExternalFundedProject

            AND
            (:projectTitle IS NULL OR :projectTitle = ''
                OR LOWER(p.projectTitle)
                LIKE LOWER(CONCAT('%', :projectTitle, '%')))

            AND
            (:pi IS NULL OR :pi = ''
                OR LOWER(p.principalInvestigator)
                LIKE LOWER(CONCAT('%', :pi, '%')))

            AND
            (:coPi IS NULL OR :coPi = ''
                OR LOWER(p.coPrincipalInvestigatorList)
                LIKE LOWER(CONCAT('%', :coPi, '%')))

            AND
            (:fundingAgencyName IS NULL OR :fundingAgencyName = ''
                OR LOWER(p.fundingAgencyName)
                LIKE LOWER(CONCAT('%', :fundingAgencyName, '%')))

            AND
            (:minAmount IS NULL
                OR p.amount >= :minAmount)

            AND
            (:maxAmount IS NULL
                OR p.amount <= :maxAmount)

            AND
            (:minDuration IS NULL
                OR p.duration >= :minDuration)

            AND
            (:maxDuration IS NULL
                OR p.duration <= :maxDuration)

            AND
            (:academicYear IS NULL OR :academicYear = ''
                OR p.academicYear = :academicYear)

            AND
            (:outcome IS NULL OR :outcome = ''
                OR LOWER(p.outcomeOfProject)
                LIKE LOWER(CONCAT('%', :outcome, '%')))

            AND
            (:status IS NULL OR :status = ''
                OR LOWER(p.statusOfTheProject)
                LIKE LOWER(CONCAT('%', :status, '%')))

            AND
            (
                :dateFrom IS NULL
                OR :dateTo IS NULL
                OR (
                    p.fromDate <= :dateTo
                    AND p.toDate >= :dateFrom
                )
            )
        """)
    Page<Projects> findExternalProjectsWithFilters(
            @Param("projectTitle") String projectTitle,
            @Param("pi") String pi,
            @Param("coPi") String coPi,
            @Param("fundingAgencyName") String fundingAgencyName,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("minDuration") Long minDuration,
            @Param("maxDuration") Long maxDuration,
            @Param("academicYear") String academicYear,
            @Param("outcome") String outcome,
            @Param("status") String status,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable
    );
}