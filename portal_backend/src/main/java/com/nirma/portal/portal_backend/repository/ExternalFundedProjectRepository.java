package com.nirma.portal.portal_backend.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.entity.ExternalFundedProject;

public interface ExternalFundedProjectRepository
        extends JpaRepository<ExternalFundedProject, Long> {

    boolean existsByProjectTitle(String projectTitle);

    @Query("""
        SELECT p
        FROM ExternalFundedProject p
        WHERE

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
                OR p.amountTotalSanctioned >= :minAmount)

            AND
            (:maxAmount IS NULL
                OR p.amountTotalSanctioned <= :maxAmount)

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
    Page<ExternalFundedProject> findProjectsWithFilters(
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