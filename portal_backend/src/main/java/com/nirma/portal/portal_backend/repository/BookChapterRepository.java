package com.nirma.portal.portal_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nirma.portal.portal_backend.entity.BookChapter;

public interface BookChapterRepository
        extends JpaRepository<BookChapter, Long>, BookChapterRepositoryCustom {

    Optional<BookChapter> findByBookChapterTitle(String bookChapterTitle);

    boolean existsByBookChapterTitle(String bookChapterTitle);
    boolean existsByBookChapterTitleAndIdNot(String bookChapterTitle, Long id);

    @Query(value = """
            SELECT DISTINCT publication_type
            FROM book_chapter
            WHERE publication_type IS NOT NULL
            ORDER BY publication_type
            """, nativeQuery = true)
    List<String> findDistinctPublicationTypes();

    @Query(value = """
            SELECT DISTINCT publication_city
            FROM book_chapter
            WHERE publication_city IS NOT NULL
            ORDER BY publication_city
            """, nativeQuery = true)
    List<String> findDistinctPublicationCities();

    @Query(value = """
            SELECT DISTINCT year_of_publication
            FROM book_chapter
            WHERE year_of_publication IS NOT NULL
            ORDER BY year_of_publication
            """, nativeQuery = true)
    List<String> findDistinctYearsOfPublication();

    @Query(value = """
            SELECT DISTINCT institute_name
            FROM book_chapter
            WHERE institute_name IS NOT NULL
            ORDER BY institute_name
            """, nativeQuery = true)
    List<String> findDistinctInstituteNames();
    
    /** One row per month: [month_total (year*12+month), count]. Month defaults to January if blank. */
    @Query(value = """
            SELECT (bc.year * 12 + COALESCE(bc.month, 1)) AS month_total,
                   COUNT(*) AS total
            FROM book_chapter bc
            WHERE bc.year IS NOT NULL
              AND (:fromTotal IS NULL OR (bc.year * 12 + COALESCE(bc.month, 1)) >= :fromTotal)
              AND (:toTotal IS NULL OR (bc.year * 12 + COALESCE(bc.month, 1)) <= :toTotal)
            GROUP BY (bc.year * 12 + COALESCE(bc.month, 1))
            """, nativeQuery = true)
    List<Object[]> countByMonth(@Param("fromTotal") Integer fromTotal,
                                @Param("toTotal") Integer toTotal);
}