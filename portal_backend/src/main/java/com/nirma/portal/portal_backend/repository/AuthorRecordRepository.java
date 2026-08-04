package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuthorRecordRepository extends JpaRepository<AuthorRecord, Long> {
	List<AuthorRecord> findByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);
	List<AuthorRecord> findByNormalizedNameContainingIgnoreCase(String normalizedName);

}
