package com.nirma.portal.portal_backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.entity.PublicationType;

public interface PublicationAuthorRepository extends JpaRepository<PublicationAuthor, Long>{
	
	List<PublicationAuthor> findByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);
	List<PublicationAuthor> findByPublicationIdInAndPublicationTypeOrderByAuthorPositionAsc(Collection<Long> publicationIds, PublicationType publicationType);
	
	 @Query(value = """
		        SELECT DISTINCT pa.publication_id
		        FROM publication_author pa
		        JOIN author_master am
		            ON pa.author_id = am.author_id
		        WHERE pa.publication_type = :publicationType
		          AND (
		              :nameFragment IS NULL
		              OR am.normalized_name LIKE CONCAT('%', UPPER(:nameFragment), '%')
		          )
		          AND (
		              :hasPositions = false
		              OR pa.author_position IN (:positions)
		          )
		        """, nativeQuery = true)
		    List<Long> findMatchingPublicationIds(
		            @Param("publicationType") String publicationType,
		            @Param("nameFragment") String nameFragment,
		            @Param("hasPositions") boolean hasPositions,
		            @Param("positions") List<Integer> positions
		    );
}
