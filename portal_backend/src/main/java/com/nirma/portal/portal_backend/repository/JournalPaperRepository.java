package com.nirma.portal.portal_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nirma.portal.portal_backend.entity.JournalPaper;

public interface JournalPaperRepository extends JpaRepository<JournalPaper, Long>, JournalPaperRepositoryCustom {

    Optional<JournalPaper> findByPaperTitle(String paperTitle);

    boolean existsByPaperTitle(String paperTitle);

    @Query(value = "SELECT DISTINCT journal_type FROM journal_paper WHERE journal_type IS NOT NULL ORDER BY journal_type", nativeQuery = true)
    List<String> findDistinctJournalTypes();

    @Query(value = "SELECT DISTINCT institute_name FROM journal_paper WHERE institute_name IS NOT NULL ORDER BY institute_name", nativeQuery = true)
    List<String> findDistinctInstituteNames();
}