package com.nirma.portal.portal_backend.specification;

import java.time.LocalDate;
import java.util.Collection;

import org.springframework.data.jpa.domain.Specification;

import com.nirma.portal.portal_backend.dto.ConferenceSearchCriteria;
import com.nirma.portal.portal_backend.entity.ConferencePaper;

public class ConferencePaperSpecifications {

    public static Specification<ConferencePaper> build(ConferenceSearchCriteria c) {
    	Specification<ConferencePaper> spec = (root, q, cb) -> null;

        if (notBlank(c.getConferenceName())) {
            String pattern = "%" + c.getConferenceName().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("conferenceName")), pattern));
        }
        if (notBlank(c.getPaperTitle())) {
            String pattern = "%" + c.getPaperTitle().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.upper(root.get("paperTitle")), pattern));
        }
        if (notBlank(c.getConferenceType()) && !"ALL".equalsIgnoreCase(c.getConferenceType())) {
            String type = c.getConferenceType();
            spec = spec.and((root, q, cb) -> cb.equal(cb.upper(root.get("conferenceType")), type.toUpperCase()));
        }
        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            spec = spec.and((root, q, cb) -> root.get("deptCode").in(c.getDepartments()));
        }
        if (notBlank(c.getInstituteName()) && !"ALL".equalsIgnoreCase(c.getInstituteName())) {
            String inst = c.getInstituteName();
            spec = spec.and((root, q, cb) -> cb.equal(root.get("instituteName"), inst));
        }
        if (c.getFromDate() != null) {
            LocalDate from = c.getFromDate();
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("fromDate"), from));
        }
        if (c.getToDate() != null) {
            LocalDate to = c.getToDate();
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("fromDate"), to));
        }
        if (c.getAcademicYear() != null) {
            spec = spec.and(dateBetween(academicYearRange(c.getAcademicYear())));
        }
        if (c.getFinancialYear() != null) {
            spec = spec.and(dateBetween(financialYearRange(c.getFinancialYear())));
        }
        if (c.getCalendarYear() != null) {
            spec = spec.and(dateBetween(calendarYearRange(c.getCalendarYear())));
        }
        return spec;
    }

    /** Extra restriction folded in after the author-name/position -> paper-id lookup. */
    public static Specification<ConferencePaper> idIn(Collection<Long> ids) {
        return (root, q, cb) -> root.get("id").in(ids);
    }

    private static Specification<ConferencePaper> dateBetween(LocalDate[] range) {
        return (root, q, cb) -> cb.between(root.get("fromDate"), range[0], range[1]);
    }

    static LocalDate[] academicYearRange(int startYear) {
        return new LocalDate[]{ LocalDate.of(startYear, 7, 1), LocalDate.of(startYear + 1, 6, 30) };
    }
    static LocalDate[] financialYearRange(int startYear) {
        return new LocalDate[]{ LocalDate.of(startYear, 4, 1), LocalDate.of(startYear + 1, 3, 31) };
    }
    static LocalDate[] calendarYearRange(int year) {
        return new LocalDate[]{ LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31) };
    }

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}