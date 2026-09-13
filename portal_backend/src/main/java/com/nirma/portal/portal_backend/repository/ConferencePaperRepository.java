package com.nirma.portal.portal_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nirma.portal.portal_backend.entity.ConferencePaper;

public interface ConferencePaperRepository extends JpaRepository<ConferencePaper, Long>, ConferencePaperRepositoryCustom {

    Optional<ConferencePaper> findByPaperTitle(String paperTitle);

    boolean existsByPaperTitle(String paperTitle);

    @Query(value = "SELECT DISTINCT conference_type FROM conference_paper WHERE conference_type IS NOT NULL ORDER BY conference_type", nativeQuery = true)
    List<String> findDistinctConferenceTypes();

    @Query(value = "SELECT DISTINCT institute_name FROM conference_paper WHERE institute_name IS NOT NULL ORDER BY institute_name", nativeQuery = true)
    List<String> findDistinctInstituteNames();
}