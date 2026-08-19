package com.nirma.portal.portal_backend.specification;

import java.util.Collection;
import java.util.Map;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import com.nirma.portal.portal_backend.dto.JournalSearchCriteria;
import com.nirma.portal.portal_backend.entity.JournalPaper;

public class JournalPaperSpecifications {

    private static final Map<String, Integer> MONTH_NUMBER = Map.ofEntries(
            Map.entry("JANUARY", 1), Map.entry("FEBRUARY", 2), Map.entry("MARCH", 3),
            Map.entry("APRIL", 4), Map.entry("MAY", 5), Map.entry("JUNE", 6),
            Map.entry("JULY", 7), Map.entry("AUGUST", 8), Map.entry("SEPTEMBER", 9),
            Map.entry("OCTOBER", 10), Map.entry("NOVEMBER", 11), Map.entry("DECEMBER", 12)
    );

    public static Specification<JournalPaper> build(JournalSearchCriteria c) {
        Specification<JournalPaper> spec = (root, q, cb) -> null;

        if (notBlank(c.getPaperTitle())) {
            String p = "%" + c.getPaperTitle().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("paperTitle")), p));
        }
        if (notBlank(c.getJournalName())) {
            String p = "%" + c.getJournalName().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("journalName")), p));
        }
        if (notBlank(c.getJournalType()) && !"ALL".equalsIgnoreCase(c.getJournalType())) {
            String type = c.getJournalType();
            spec = spec.and((root, q, cb) -> cb.equal(cb.upper(root.get("journalType")), type.toUpperCase()));
        }
        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            spec = spec.and((root, q, cb) -> root.get("deptCode").in(c.getDepartments()));
        }
        if (notBlank(c.getInstituteName()) && !"ALL".equalsIgnoreCase(c.getInstituteName())) {
            String inst = c.getInstituteName();
            spec = spec.and((root, q, cb) -> cb.equal(root.get("instituteName"), inst));
        }
        if (notBlank(c.getIssnNo())) {
            String p = "%" + c.getIssnNo().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("issnNo")), p));
        }
        if (notBlank(c.getVolumeNo())) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("volumeNo"), c.getVolumeNo().trim()));
        }
        if (notBlank(c.getIssueNo())) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("issueNo"), c.getIssueNo().trim()));
        }
        if (notBlank(c.getPageNo())) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("pageNo"), c.getPageNo().trim()));
        }
        if (notBlank(c.getDoiNumber())) {
            String p = "%" + c.getDoiNumber().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("doiNumber")), p));
        }
        if (c.getIndexIn() != null && !c.getIndexIn().isEmpty()) {
            for (String idx : c.getIndexIn()) {
                if (notBlank(idx)) {
                    String p = "%" + idx.trim().toUpperCase() + "%";
                    spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("indexIn")), p));
                }
            }
        }
        if (c.getFromYear() != null || c.getToYear() != null) {
            Integer fromTotal = totalMonths(c.getFromYear(), c.getFromMonth(), true);
            Integer toTotal = totalMonths(c.getToYear(), c.getToMonth(), false);
            spec = spec.and(totalMonthsBetween(fromTotal, toTotal));
        }
        if (c.getAcademicYear() != null) {
            int from = c.getAcademicYear() * 12 + 7;
            int to = (c.getAcademicYear() + 1) * 12 + 6;
            spec = spec.and(totalMonthsBetween(from, to));
        }
        if (c.getFinancialYear() != null) {
            int from = c.getFinancialYear() * 12 + 4;
            int to = (c.getFinancialYear() + 1) * 12 + 3;
            spec = spec.and(totalMonthsBetween(from, to));
        }
        if (c.getCalendarYear() != null) {
            int from = c.getCalendarYear() * 12 + 1;
            int to = c.getCalendarYear() * 12 + 12;
            spec = spec.and(totalMonthsBetween(from, to));
        }

        return spec;
    }

    public static Specification<JournalPaper> idIn(Collection<Long> ids) {
        return (root, q, cb) -> root.get("id").in(ids);
    }

    private static Expression<Integer> totalMonthsExpr(Root<JournalPaper> root, CriteriaBuilder cb) {
        CriteriaBuilder.Case<Integer> monthCase = cb.selectCase();
        for (Map.Entry<String, Integer> e : MONTH_NUMBER.entrySet()) {
            monthCase = monthCase.when(cb.equal(cb.upper(root.get("monthOfPublication")), e.getKey()), e.getValue());
        }
        Expression<Integer> monthNum = monthCase.otherwise(1);
        Expression<Integer> year = root.get("yearOfPublication");
        return cb.sum(cb.prod(year, 12), monthNum);
    }

    private static Specification<JournalPaper> totalMonthsBetween(Integer from, Integer to) {
        return (root, q, cb) -> {
            Expression<Integer> total = totalMonthsExpr(root, cb);
            if (from != null && to != null) return cb.between(total, from, to);
            if (from != null) return cb.greaterThanOrEqualTo(total, from);
            return cb.lessThanOrEqualTo(total, to);
        };
    }

    private static Integer totalMonths(Integer year, String month, boolean isFromBound) {
        if (year == null) return null;
        int monthNum = notBlank(month)
                ? MONTH_NUMBER.getOrDefault(month.trim().toUpperCase(), isFromBound ? 1 : 12)
                : (isFromBound ? 1 : 12);
        return year * 12 + monthNum;
    }

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}