package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.JournalPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JournalPaperRepository extends JpaRepository<JournalPaper, Long>,
		org.springframework.data.jpa.repository.JpaSpecificationExecutor<JournalPaper> {
	Optional<JournalPaper> findByPaperTitle(String paperTitle);
	boolean existsByPaperTitle(String paperTitle);
}