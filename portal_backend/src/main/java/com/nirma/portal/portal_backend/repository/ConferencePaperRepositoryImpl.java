package com.nirma.portal.portal_backend.repository;

import java.time.LocalDate;
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

import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.entity.ConferencePaper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ConferencePaperRepositoryImpl implements ConferencePaperRepositoryCustom {

    private static final Map<String, String> SORTABLE_FIELDS = Map.of(
            "id", "cp.id",
            "conferenceName", "cp.conference_name",
            "paperTitle", "cp.paper_title",
            "conferenceType", "cp.conference_type",
            "fromDate", "cp.from_date",
            "toDate", "cp.to_date"
    );

    private final EntityManager entityManager;

    @Override
    public Page<ConferencePaper> search(
            ConferenceSearchCriteria c,
            LocalDate fromDate,
            LocalDate toDate,
            List<Long> authorIds,
            Pageable pageable
    ) {
        if (authorIds != null && authorIds.isEmpty()) {
            return Page.empty(pageable);
        }

        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (notBlank(c.getConferenceName())) {
            where.append(" AND UPPER(cp.conference_name) LIKE :conferenceName ");
            params.put("conferenceName", "%" + c.getConferenceName().toUpperCase() + "%");
        }
        if (notBlank(c.getPaperTitle())) {
            where.append(" AND UPPER(cp.paper_title) LIKE :paperTitle ");
            params.put("paperTitle", "%" + c.getPaperTitle().toUpperCase() + "%");
        }
        if (notBlank(c.getConferenceType())) {
            where.append(" AND UPPER(cp.conference_type) = :conferenceType ");
            params.put("conferenceType", c.getConferenceType().toUpperCase());
        }
        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            where.append(" AND cp.dept_code IN (:departments) ");
            params.put("departments", c.getDepartments());
        }
        if (notBlank(c.getInstituteName())) {
            where.append(" AND cp.institute_name = :instituteName ");
            params.put("instituteName", c.getInstituteName());
        }
        if (fromDate != null) {
            where.append(" AND cp.from_date >= :fromDate ");
            params.put("fromDate", fromDate);
        }
        if (toDate != null) {
            where.append(" AND cp.from_date <= :toDate ");
            params.put("toDate", toDate);
        }
        if (authorIds != null) {
            where.append(" AND cp.id IN (:authorIds) ");
            params.put("authorIds", authorIds);
        }

        String orderBy = buildOrderBy(pageable.getSort());

        String dataSql = "SELECT cp.* FROM conference_paper cp" + where + orderBy;
        String countSql = "SELECT COUNT(*) FROM conference_paper cp" + where;

        Query dataQuery = entityManager.createNativeQuery(dataSql, ConferencePaper.class);
        Query countQuery = entityManager.createNativeQuery(countSql);
        params.forEach((k, v) -> {
            dataQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        @SuppressWarnings("unchecked")
        List<ConferencePaper> results = dataQuery.getResultList();
        long total = ((Number) countQuery.getSingleResult()).longValue();

        return new PageImpl<>(results, pageable, total);
    }

    private String buildOrderBy(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }
        StringBuilder sb = new StringBuilder(" ORDER BY ");
        boolean first = true;
        for (Sort.Order order : sort) {
            String column = SORTABLE_FIELDS.get(order.getProperty());
            if (column == null) continue;
            if (!first) sb.append(", ");
            sb.append(column).append(order.isAscending() ? " ASC" : " DESC");
            first = false;
        }
        return first ? "" : sb.toString();
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}