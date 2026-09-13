package com.nirma.portal.portal_backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.PublicationType;

public interface AuthorRecordRepository extends JpaRepository<AuthorRecord, Long> {

    List<AuthorRecord> findByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);

    List<AuthorRecord> findByNormalizedNameContainingIgnoreCase(String normalizedName);

    List<AuthorRecord> findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(
            Collection<Long> publicationIds, PublicationType publicationType);

    @Query(value = """
        SELECT DISTINCT publication_id FROM author_record ar
        WHERE ar.publication_type = :publicationType
          AND (:nameFragment IS NULL OR ar.normalized_name LIKE CONCAT('%', UPPER(:nameFragment), '%'))
          AND (:hasPositions = false OR ar.author_position IN (:positions))
        """, nativeQuery = true)
    List<Long> findMatchingPublicationIds(
            @Param("publicationType") String publicationType,
            @Param("nameFragment") String nameFragment,
            @Param("hasPositions") boolean hasPositions,
            @Param("positions") List<Integer> positions
    );
}