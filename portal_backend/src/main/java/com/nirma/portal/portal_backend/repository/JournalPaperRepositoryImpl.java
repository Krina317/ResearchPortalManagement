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

import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.entity.JournalPaper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class JournalPaperRepositoryImpl implements JournalPaperRepositoryCustom {

    private static final Map<String, String> SORTABLE_FIELDS = Map.of(
            "id", "jp.id",
            "paperTitle", "jp.paper_title",
            "journalName", "jp.journal_name",
            "journalType", "jp.journal_type",
            "yearOfPublication", "jp.year_of_publication",
            "impactFactorClarivate", "jp.impact_factor_clarivate",
            "impactFactorJournal", "jp.impact_factor_journal"
    );

    private static final String MONTH_EXPR = """
            (jp.year_of_publication * 12 +
             CASE UPPER(jp.month_of_publication)
               WHEN 'JANUARY' THEN 1 WHEN 'FEBRUARY' THEN 2 WHEN 'MARCH' THEN 3
               WHEN 'APRIL' THEN 4 WHEN 'MAY' THEN 5 WHEN 'JUNE' THEN 6
               WHEN 'JULY' THEN 7 WHEN 'AUGUST' THEN 8 WHEN 'SEPTEMBER' THEN 9
               WHEN 'OCTOBER' THEN 10 WHEN 'NOVEMBER' THEN 11 WHEN 'DECEMBER' THEN 12
               ELSE 1 END)
            """;

    private final EntityManager entityManager;

    @Override
    public Page<JournalPaper> search(
            JournalSearchCriteria c,
            Integer fromTotal,
            Integer toTotal,
            List<String> indexInTags,
            List<Long> authorIds,
            Pageable pageable
    ) {
        if (authorIds != null && authorIds.isEmpty()) {
            return Page.empty(pageable);
        }

        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (notBlank(c.getPaperTitle())) {
            where.append(" AND UPPER(jp.paper_title) LIKE :paperTitle ");
            params.put("paperTitle", "%" + c.getPaperTitle().toUpperCase() + "%");
        }
        if (notBlank(c.getJournalName())) {
            where.append(" AND UPPER(jp.journal_name) LIKE :journalName ");
            params.put("journalName", "%" + c.getJournalName().toUpperCase() + "%");
        }
        if (notBlank(c.getJournalType())) {
            where.append(" AND UPPER(jp.journal_type) = :journalType ");
            params.put("journalType", c.getJournalType().toUpperCase());
        }
        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            where.append(" AND jp.dept_name IN (:departments) ");
            params.put("departments", c.getDepartments());
        }
        if (notBlank(c.getInstituteName())) {
            where.append(" AND jp.institute_name = :instituteName ");
            params.put("instituteName", c.getInstituteName());
        }
        if (notBlank(c.getIssnNo())) {
            where.append(" AND UPPER(jp.issn_no) LIKE :issnNo ");
            params.put("issnNo", "%" + c.getIssnNo().toUpperCase() + "%");
        }
        if (notBlank(c.getVolumeNo())) {
            where.append(" AND jp.volume_no = :volumeNo ");
            params.put("volumeNo", c.getVolumeNo());
        }
        if (notBlank(c.getIssueNo())) {
            where.append(" AND jp.issue_no = :issueNo ");
            params.put("issueNo", c.getIssueNo());
        }
        if (notBlank(c.getPageNo())) {
            where.append(" AND jp.page_no = :pageNo ");
            params.put("pageNo", c.getPageNo());
        }
        if (notBlank(c.getDoiNumber())) {
            where.append(" AND UPPER(jp.doi_number) LIKE :doiNumber ");
            params.put("doiNumber", "%" + c.getDoiNumber().toUpperCase() + "%");
        }
        if (notBlank(c.getArticleLink())) {
            where.append(" AND UPPER(jp.article_link) LIKE :articleLink ");
            params.put("articleLink", "%" + c.getArticleLink().toUpperCase() + "%");
        }
        if (indexInTags != null && !indexInTags.isEmpty()) {
            StringBuilder tagGroup = new StringBuilder(" AND (");
            for (int i = 0; i < indexInTags.size(); i++) {
                if (i > 0) tagGroup.append(" OR ");
                String key = "indexInTag" + i;
                tagGroup.append("jp.index_in LIKE :").append(key);
                params.put(key, "%" + indexInTags.get(i) + "%");
            }
            tagGroup.append(") ");
            where.append(tagGroup);
        }
        if (c.getMinImpactFactorClarivate() != null) {
            where.append(" AND jp.impact_factor_clarivate >= :minIfc ");
            params.put("minIfc", c.getMinImpactFactorClarivate());
        }
        if (c.getMaxImpactFactorClarivate() != null) {
            where.append(" AND jp.impact_factor_clarivate <= :maxIfc ");
            params.put("maxIfc", c.getMaxImpactFactorClarivate());
        }
        if (c.getMinImpactFactorJournal() != null) {
            where.append(" AND jp.impact_factor_journal >= :minIfj ");
            params.put("minIfj", c.getMinImpactFactorJournal());
        }
        if (c.getMaxImpactFactorJournal() != null) {
            where.append(" AND jp.impact_factor_journal <= :maxIfj ");
            params.put("maxIfj", c.getMaxImpactFactorJournal());
        }
        if (fromTotal != null) {
            where.append(" AND ").append(MONTH_EXPR).append(" >= :fromTotal ");
            params.put("fromTotal", fromTotal);
        }
        if (toTotal != null) {
            where.append(" AND ").append(MONTH_EXPR).append(" <= :toTotal ");
            params.put("toTotal", toTotal);
        }
        if (authorIds != null) {
            where.append(" AND jp.id IN (:authorIds) ");
            params.put("authorIds", authorIds);
        }

        String orderBy = buildOrderBy(pageable.getSort());

        String dataSql = "SELECT jp.* FROM journal_paper jp" + where + orderBy;
        String countSql = "SELECT COUNT(*) FROM journal_paper jp" + where;

        Query dataQuery = entityManager.createNativeQuery(dataSql, JournalPaper.class);
        Query countQuery = entityManager.createNativeQuery(countSql);
        params.forEach((k, v) -> {
            dataQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        dataQuery.setFirstResult((int) pageable.getOffset());
        dataQuery.setMaxResults(pageable.getPageSize());

        @SuppressWarnings("unchecked")
        List<JournalPaper> results = dataQuery.getResultList();
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
            if (column == null) {
                continue;
            }
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