package com.nirma.portal.portal_backend.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.FacultyList;
import com.nirma.portal.portal_backend.matching.FacultyNameMatcher;
import com.nirma.portal.portal_backend.matching.FacultyNameMatcher.Result;
import com.nirma.portal.portal_backend.repository.FacultyListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacultyMatchService {

    /** Types that are set by hand from the frontend; the matcher must never overwrite them. */
    private static final Set<String> STUDENT_TYPES = Set.of("UG", "PG", "PHD");

    private final FacultyListRepository facultyListRepository;
    private volatile FacultyNameMatcher matcher;

    /** Rebuilds the matcher from the FacultyList table. Call once at the start of each import. */
    public synchronized void refresh() {
        List<FacultyNameMatcher.Faculty> list = facultyListRepository.findAll().stream()
                .map(f -> new FacultyNameMatcher.Faculty(f.getId(), f.getName()))
                .toList();
        if (list.isEmpty()) {
            log.warn("FacultyList table is empty: no author can be matched as NU");
        }
        matcher = new FacultyNameMatcher(list);
        log.info("Faculty matcher loaded with {} faculty records", list.size());
    }

    private FacultyNameMatcher matcher() {
        FacultyNameMatcher m = matcher;
        if (m == null) {
            refresh();
            m = matcher;
        }
        return m;
    }

    /**
     * Sets authorType, faculty, needsReview and matchReason on the author.
     * Rows a person has classified (manuallyVerified, or UG/PG/PHD) are left untouched.
     */
    public void applyTo(AuthorMaster author, String rawName) {
        String type = author.getAuthorType();
        if (author.isManuallyVerified() || (type != null && STUDENT_TYPES.contains(type))) {
            return;
        }

        Result r = matcher().match(rawName);
        String reason = (r.reason() == null || r.reason().isBlank()) ? null : truncate(r.reason(), 500);
        FacultyList facultyRef = (r.facultyId() == null) ? null : facultyListRepository.getReferenceById(r.facultyId());

        switch (r.status()) {
            case NU -> {
                author.setAuthorType("NU");
                author.setFaculty(facultyRef);
                author.setNeedsReview(r.needsReview());
                author.setMatchReason(reason);
            }
            case REVIEW -> {
                author.setAuthorType(null);
                author.setFaculty(facultyRef);      // the suggested faculty, only if there is exactly one
                author.setNeedsReview(true);
                author.setMatchReason(reason);
            }
            case NO_MATCH -> {
                author.setAuthorType(null);          // student or external, decided later by hand
                author.setFaculty(null);
                author.setNeedsReview(false);
                author.setMatchReason(reason);       // usually empty; set when a middle initial ruled someone out
            }
        }
    }

    private static String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max);
    }
}