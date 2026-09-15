package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.NuFundedProject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NuFundedProjectRepository
        extends JpaRepository<NuFundedProject, Long> {

    boolean existsByProjectTitle(String projectTitle);

    @Query("""
        SELECT p
        FROM NuFundedProject p
        WHERE
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
                OR p.projectCategory = :projectCategory)

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
                OR LOWER(p.outcomeOfResearchProject)
                LIKE LOWER(CONCAT('%', :outcome, '%')))
        """)
    Page<NuFundedProject> findProjectsWithFilters(
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
}