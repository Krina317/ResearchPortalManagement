package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.ConferencePaper;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConferencePaperRepository extends JpaRepository<ConferencePaper, Long> ,
		org.springframework.data.jpa.repository.JpaSpecificationExecutor<ConferencePaper>{
	Optional<ConferencePaper> findByPaperTitle(String paperTitle);
	boolean existsByPaperTitle(String paperTitle);
	
}
