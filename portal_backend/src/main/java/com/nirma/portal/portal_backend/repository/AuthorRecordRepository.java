package com.nirma.portal.portal_backend.repository;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.PublicationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AuthorRecordRepository extends JpaRepository<AuthorRecord, Long>,
		org.springframework.data.jpa.repository.JpaSpecificationExecutor<AuthorRecord>{
	List<AuthorRecord> findByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);
	List<AuthorRecord> findByNormalizedNameContainingIgnoreCase(String normalizedName);
	List<AuthorRecord> findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(Collection<Long> publicationIds, PublicationType publicationType);

}
