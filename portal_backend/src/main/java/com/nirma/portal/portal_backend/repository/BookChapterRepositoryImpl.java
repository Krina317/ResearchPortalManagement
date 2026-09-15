package com.nirma.portal.portal_backend.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.nirma.portal.portal_backend.dto.BookChapterSearchCriteria;
import com.nirma.portal.portal_backend.entity.BookChapter;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BookChapterRepositoryImpl implements BookChapterRepositoryCustom {

    private static final Map<String, String> SORTABLE_FIELDS = Map.of(
            "id", "bc.id",
            "bookTitle", "bc.book_title",
            "bookChapterTitle", "bc.book_chapter_title",
            "nameOfBookPublisher", "bc.name_of_book_publisher",
            "month", "bc.month",
            "year", "bc.year",
            "yearOfPublication", "bc.year_of_publication",
            "publicationType", "bc.publication_type",
            "publicationCity", "bc.publication_city"
    );

    /*
     * Converts Book Chapter month/year into one continuous number.
     *
     * Example:
     * January 2025  -> 2025 * 12 + 1
     * December 2025 -> 2025 * 12 + 12
     * January 2026  -> 2026 * 12 + 1
     *
     * This allows us to perform a proper month/year range comparison.
     */
    private static final String MONTH_EXPR = """
            (bc.year * 12 + bc.month)
            """;

    private final EntityManager entityManager;

    @Override
    public Page<BookChapter> search(
            BookChapterSearchCriteria c,
            Integer fromTotal,
            Integer toTotal,
            List<Long> authorIds,
            Pageable pageable
    ) {

        if (authorIds != null && authorIds.isEmpty()) {
            return Page.empty(pageable);
        }

        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (notBlank(c.getBookTitle())) {
            where.append(" AND UPPER(bc.book_title) LIKE :bookTitle ");
            params.put(
                    "bookTitle",
                    "%" + c.getBookTitle().toUpperCase() + "%"
            );
        }

        if (notBlank(c.getBookChapterTitle())) {
            where.append(" AND UPPER(bc.book_chapter_title) LIKE :bookChapterTitle ");
            params.put(
                    "bookChapterTitle",
                    "%" + c.getBookChapterTitle().toUpperCase() + "%"
            );
        }

        if (notBlank(c.getNameOfBookPublisher())) {
            where.append(" AND UPPER(bc.name_of_book_publisher) LIKE :publisher ");
            params.put(
                    "publisher",
                    "%" + c.getNameOfBookPublisher().toUpperCase() + "%"
            );
        }

        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            where.append(" AND bc.dept_name IN (:departments) ");
            params.put("departments", c.getDepartments());
        }

        if (notBlank(c.getInstituteName())) {
            where.append(" AND bc.institute_name = :instituteName ");
            params.put("instituteName", c.getInstituteName());
        }

        if (notBlank(c.getPublicationType())) {
            where.append(" AND UPPER(bc.publication_type) = :publicationType ");
            params.put(
                    "publicationType",
                    c.getPublicationType().toUpperCase()
            );
        }

        if (notBlank(c.getPublicationCity())) {
            where.append(" AND UPPER(bc.publication_city) = :publicationCity ");
            params.put(
                    "publicationCity",
                    c.getPublicationCity().toUpperCase()
            );
        }

        if (notBlank(c.getYearOfPublication())) {
            where.append(" AND bc.year_of_publication = :yearOfPublication ");
            params.put(
                    "yearOfPublication",
                    c.getYearOfPublication()
            );
        }

        if (notBlank(c.getIsbnNo())) {
            where.append(" AND UPPER(bc.isbn_no) LIKE :isbnNo ");
            params.put(
                    "isbnNo",
                    "%" + c.getIsbnNo().toUpperCase() + "%"
            );
        }

        if (fromTotal != null) {
            where.append(" AND ")
                 .append(MONTH_EXPR)
                 .append(" >= :fromTotal ");

            params.put("fromTotal", fromTotal);
        }

        if (toTotal != null) {
            where.append(" AND ")
                 .append(MONTH_EXPR)
                 .append(" <= :toTotal ");

            params.put("toTotal", toTotal);
        }

        if (authorIds != null) {
            where.append(" AND bc.id IN (:authorIds) ");
            params.put("authorIds", authorIds);
        }

        String orderBy = buildOrderBy(pageable.getSort());

        String dataSql =
                "SELECT bc.* FROM book_chapter bc"
                + where
                + orderBy;

        String countSql =
                "SELECT COUNT(*) FROM book_chapter bc"
                + where;

        Query dataQuery =
                entityManager.createNativeQuery(dataSql, BookChapter.class);

        Query countQuery =
                entityManager.createNativeQuery(countSql);

        params.forEach((k, v) -> {
            dataQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        @SuppressWarnings("unchecked")
        List<BookChapter> results = dataQuery.getResultList();

        long total =
                ((Number) countQuery.getSingleResult()).longValue();

        return new PageImpl<>(results, pageable, total);
    }

    private String buildOrderBy(Sort sort) {

        if (sort.isUnsorted()) {
            return "";
        }

        StringBuilder sb = new StringBuilder(" ORDER BY ");
        boolean first = true;

        for (Sort.Order order : sort) {

            String column =
                    SORTABLE_FIELDS.get(order.getProperty());

            if (column == null) {
                continue;
            }

            if (!first) {
                sb.append(", ");
            }

            sb.append(column)
              .append(order.isAscending() ? " ASC" : " DESC");

            first = false;
        }

        return first ? "" : sb.toString();
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}