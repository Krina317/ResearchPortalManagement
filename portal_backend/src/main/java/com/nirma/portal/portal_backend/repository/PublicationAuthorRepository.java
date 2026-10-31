package com.nirma.portal.portal_backend.repository;

import java.util.Collection;
import java.util.List;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.nirma.portal.portal_backend.dto.FacultyScoreView;
import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;
import com.nirma.portal.portal_backend.dto.ConferenceFacultyScoreView;


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
		            JOIN (
		                SELECT id,
		                       year_of_publication * 12
		                         + COALESCE(NULLIF(FIELD(UPPER(month_of_publication),
		                             'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
		                             'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'), 0), 1) AS period,
		                       UPPER(TRIM(quartile)) AS quartile
		                FROM journal_paper
		            ) jp ON jp.id = pa2.publication_id
		            WHERE pa2.publication_type = 'JOURNAL'
		              AND am2.faculty_id IS NOT NULL
		              AND (:fromTotal IS NULL OR jp.period >= :fromTotal)
		              AND (:toTotal IS NULL OR jp.period <= :toTotal)
		              AND (:hasQuartiles = false OR jp.quartile IN (:quartiles))
		            GROUP BY pa2.publication_id
		        ) c ON c.publication_id = pa.publication_id
		        WHERE pa.publication_type = 'JOURNAL'
		        GROUP BY f.id, f.name
		        """, nativeQuery = true)
		List<FacultyScoreView> findJournalFacultyScores(@Param("fromTotal") Integer fromTotal,
		                                                @Param("toTotal") Integer toTotal,
		                                                @Param("hasQuartiles") boolean hasQuartiles,
		                                                @Param("quartiles") List<String> quartiles);

		@Query(value = """
		        SELECT UPPER(TRIM(pa.student_type)) AS studentType,
		               COUNT(DISTINCT pa.publication_id) AS total
		        FROM publication_author pa
		        JOIN (
		            SELECT id,
		                   year_of_publication * 12
		                     + COALESCE(NULLIF(FIELD(UPPER(month_of_publication),
		                         'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
		                         'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'), 0), 1) AS period,
		                   UPPER(TRIM(quartile)) AS quartile
		            FROM journal_paper
		        ) jp ON jp.id = pa.publication_id
		        WHERE pa.publication_type = 'JOURNAL'
		          AND pa.student_type IS NOT NULL
		          AND (:fromTotal IS NULL OR jp.period >= :fromTotal)
		          AND (:toTotal IS NULL OR jp.period <= :toTotal)
		          AND (:hasQuartiles = false OR jp.quartile IN (:quartiles))
		        GROUP BY UPPER(TRIM(pa.student_type))
		        """, nativeQuery = true)
		List<StudentTypeCountView> countJournalStudentsByType(@Param("fromTotal") Integer fromTotal,
		                                                      @Param("toTotal") Integer toTotal,
		                                                      @Param("hasQuartiles") boolean hasQuartiles,
		                                                      @Param("quartiles") List<String> quartiles);
		void deleteByPublicationIdAndPublicationType(Long publicationId, PublicationType publicationType);
		
		

		@Query(value = """
		        SELECT f.id             AS facultyId,
		               f.name           AS facultyName,
		               f.faculty_status AS facultyStatus,
		               x.academic_year  AS academicYear,
		               x.paper_count    AS paperCount
		        FROM faculty_list f
		        LEFT JOIN (
		            SELECT am.faculty_id AS faculty_id,
		                   jp.academic_year AS academic_year,
		                   COUNT(DISTINCT pa.publication_id) AS paper_count
		            FROM publication_author pa
		            JOIN author_master am ON am.author_id = pa.author_id
		            JOIN (
		                SELECT id,
		                       (year_of_publication * 12
		                         + COALESCE(NULLIF(FIELD(UPPER(month_of_publication),
		                             'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
		                             'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'), 0), 1)
		                         - 7) DIV 12 AS academic_year
		                FROM journal_paper
		                WHERE year_of_publication IS NOT NULL
		            ) jp ON jp.id = pa.publication_id
		            WHERE pa.publication_type = 'JOURNAL'
		              AND am.faculty_id IS NOT NULL
		              AND jp.academic_year BETWEEN :fromYear AND :toYear
		            GROUP BY am.faculty_id, jp.academic_year
		        ) x ON x.faculty_id = f.id
		        ORDER BY f.name, x.academic_year
		        """, nativeQuery = true)
		List<FacultyYearCountView> findJournalPapersPerFacultyByAcademicYear(
		        @Param("fromYear") int fromYear,
		        @Param("toYear") int toYear);

		long countByAuthor_AuthorId(Long authorId);
		@Query(value = """
		        SELECT f.id   AS facultyId,
		               f.name AS facultyName,
		               SUM(1.0E0 / c.nu_count) AS conferenceScore
		        FROM publication_author pa
		        JOIN author_master am ON am.author_id = pa.author_id
		        JOIN faculty_list f   ON f.id = am.faculty_id
		        JOIN (
		            SELECT pa2.publication_id, COUNT(*) AS nu_count
		            FROM publication_author pa2
		            JOIN author_master am2 ON am2.author_id = pa2.author_id
		            JOIN conference_paper cp ON cp.id = pa2.publication_id
		            WHERE pa2.publication_type = 'CONFERENCE'
		              AND am2.faculty_id IS NOT NULL
		              AND (:fromDate IS NULL OR cp.from_date >= :fromDate)
		              AND (:toDate IS NULL OR cp.from_date <= :toDate)
		            GROUP BY pa2.publication_id
		        ) c ON c.publication_id = pa.publication_id
		        WHERE pa.publication_type = 'CONFERENCE'
		        GROUP BY f.id, f.name
		        """, nativeQuery = true)
		List<ConferenceFacultyScoreView> findConferenceFacultyScores(@Param("fromDate") LocalDate fromDate,
		                                                             @Param("toDate") LocalDate toDate);

		@Query(value = """
		        SELECT UPPER(TRIM(pa.student_type)) AS studentType,
		               COUNT(DISTINCT pa.publication_id) AS total
		        FROM publication_author pa
		        JOIN conference_paper cp ON cp.id = pa.publication_id
		        WHERE pa.publication_type = 'CONFERENCE'
		          AND pa.student_type IS NOT NULL
		          AND (:fromDate IS NULL OR cp.from_date >= :fromDate)
		          AND (:toDate IS NULL OR cp.from_date <= :toDate)
		        GROUP BY UPPER(TRIM(pa.student_type))
		        """, nativeQuery = true)
		List<StudentTypeCountView> countConferencePapersByStudentType(@Param("fromDate") LocalDate fromDate,
		                                                              @Param("toDate") LocalDate toDate);
}
