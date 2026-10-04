package com.nirma.portal.portal_backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.dto.FacultyScoreView;
import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;


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
	 
		@Query("""
		        SELECT DISTINCT a
		        FROM PublicationAuthor pa JOIN pa.author a
		        WHERE pa.publicationType = :type AND a.needsReview = true
		        ORDER BY a.displayName
		        """)
		List<AuthorMaster> findAuthorsNeedingReview(@Param("type") PublicationType type);
		
		@Query(value = """
			    SELECT f.id   AS facultyId,
			           f.name AS facultyName,
			           SUM(1.0E0 / c.nu_count) AS journalScore
			    FROM publication_author pa
			    JOIN author_master am ON am.author_id = pa.author_id
			    JOIN faculty_list f   ON f.id = am.faculty_id
			    JOIN (
			        SELECT pa2.publication_id, COUNT(*) AS nu_count
			        FROM publication_author pa2
			        JOIN author_master am2 ON am2.author_id = pa2.author_id
			        JOIN journal_paper jp  ON jp.id = pa2.publication_id
			        WHERE pa2.publication_type = 'JOURNAL'
			          AND am2.faculty_id IS NOT NULL
			        GROUP BY pa2.publication_id
			    ) c ON c.publication_id = pa.publication_id
			    WHERE pa.publication_type = 'JOURNAL'
			    GROUP BY f.id, f.name
			    """, nativeQuery = true)
			List<FacultyScoreView> findJournalFacultyScores();
		
		@Query(value = """
			    SELECT UPPER(TRIM(pa.student_type)) AS studentType,
			           COUNT(DISTINCT pa.author_id)  AS total
			    FROM publication_author pa
			    WHERE pa.publication_type = 'JOURNAL'
			      AND pa.student_type IS NOT NULL
			    GROUP BY UPPER(TRIM(pa.student_type))
			    """, nativeQuery = true)
			List<StudentTypeCountView> countJournalStudentsByType();
		
		void deleteByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);

		long countByAuthor_AuthorId(Long authorId);
}
