package com.nirma.portal.portal_backend.specification;

import java.util.Collection;

import org.springframework.data.jpa.domain.Specification;

import com.nirma.portal.portal_backend.dto.BookChapterSearchCriteria;
import com.nirma.portal.portal_backend.entity.BookChapter;

public class BookChapterSpecifications {

    public static Specification<BookChapter> build(BookChapterSearchCriteria c) {

        Specification<BookChapter> spec = (root, q, cb) -> null;

        if (notBlank(c.getBookTitle())) {
            String pattern = "%" + c.getBookTitle().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.upper(root.get("bookTitle")), pattern));
        }

        if (notBlank(c.getBookChapterTitle())) {
            String pattern = "%" + c.getBookChapterTitle().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.upper(root.get("bookChapterTitle")), pattern));
        }

        if (notBlank(c.getNameOfBookPublisher())) {
            String pattern = "%" + c.getNameOfBookPublisher().trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.upper(root.get("nameOfBookPublisher")), pattern));
        }

        if (c.getDepartments() != null && !c.getDepartments().isEmpty()) {
            spec = spec.and((root, q, cb) ->
                    root.get("deptName").in(c.getDepartments()));
        }

        if (notBlank(c.getInstituteName()) &&
                !"ALL".equalsIgnoreCase(c.getInstituteName())) {

            String institute = c.getInstituteName();

            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("instituteName"), institute));
        }

        if (notBlank(c.getPublicationType()) &&
                !"ALL".equalsIgnoreCase(c.getPublicationType())) {

            String type = c.getPublicationType();

            spec = spec.and((root, q, cb) ->
                    cb.equal(
                            cb.upper(root.get("publicationType")),
                            type.toUpperCase()
                    ));
        }

        if (notBlank(c.getPublicationCity()) &&
                !"ALL".equalsIgnoreCase(c.getPublicationCity())) {

            String city = c.getPublicationCity();

            spec = spec.and((root, q, cb) ->
                    cb.equal(
                            cb.upper(root.get("publicationCity")),
                            city.toUpperCase()
                    ));
        }

        if (notBlank(c.getYearOfPublication()) &&
                !"ALL".equalsIgnoreCase(c.getYearOfPublication())) {

            String publicationYear = c.getYearOfPublication();

            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("yearOfPublication"), publicationYear));
        }

        if (notBlank(c.getIsbnNo())) {
            String pattern = "%" + c.getIsbnNo().trim().toUpperCase() + "%";

            spec = spec.and((root, q, cb) ->
                    cb.like(cb.upper(root.get("isbnNo")), pattern));
        }

        /*
         * Explicit month/year range.
         *
         * BookChapter stores:
         *     month -> Integer
         *     year  -> Integer
         *
         * We convert them into one continuous value:
         *
         *     year * 12 + month
         *
         * so ranges can cross years correctly.
         */
        if (c.getFromYear() != null || c.getToYear() != null) {

            Integer fromTotal =
                    totalMonths(
                            c.getFromYear(),
                            c.getFromMonth(),
                            true
                    );

            Integer toTotal =
                    totalMonths(
                            c.getToYear(),
                            c.getToMonth(),
                            false
                    );

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

    /**
     * Extra restriction used after author-name/position
     * lookup has produced publication IDs.
     */
    public static Specification<BookChapter> idIn(Collection<Long> ids) {
        return (root, q, cb) ->
                root.get("id").in(ids);
    }

    private static Specification<BookChapter> totalMonthsBetween(
            Integer from,
            Integer to
    ) {

        return (root, q, cb) -> {

            var year = root.<Integer>get("year");
            var month = root.<Integer>get("month");

            var total = cb.sum(
                    cb.prod(year, 12),
                    month
            );

            if (from != null && to != null) {
                return cb.between(total, from, to);
            }

            if (from != null) {
                return cb.greaterThanOrEqualTo(total, from);
            }

            return cb.lessThanOrEqualTo(total, to);
        };
    }

    private static Integer totalMonths(
            Integer year,
            String month,
            boolean isFromBound
    ) {

        if (year == null) {
            return null;
        }

        int monthNum;

        if (notBlank(month)) {
            try {
                monthNum = Integer.parseInt(month.trim());

                if (monthNum < 1 || monthNum > 12) {
                    monthNum = isFromBound ? 1 : 12;
                }

            } catch (NumberFormatException e) {
                monthNum = isFromBound ? 1 : 12;
            }

        } else {
            monthNum = isFromBound ? 1 : 12;
        }

        return year * 12 + monthNum;
    }

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}