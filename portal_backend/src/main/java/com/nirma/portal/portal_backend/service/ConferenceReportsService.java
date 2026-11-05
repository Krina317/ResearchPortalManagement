package com.nirma.portal.portal_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.ConferenceFacultyResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;
import com.nirma.portal.portal_backend.dto.ConferenceReportFilter;
import com.nirma.portal.portal_backend.dto.ConferenceChartsResponseDTO;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.repository.FacultyYearCountView;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConferenceReportsService {

    private static final List<String> STUDENT_TYPES = List.of("UG", "PG", "PHD");

    private final PublicationAuthorRepository publicationAuthorRepository;
    private final ConferencePaperRepository conferencePaperRepository;
    
    private static final List<String> TYPE_LABELS = List.of("National", "International");
    private static final List<String> QUARTILE_LABELS =
            List.of("Q1", "Q2", "Q3", "Q4", "Scopus Only", "N/A");

    // academic years shown in Conference Statistics, by start year (2025 = 2025-26). Extend LAST to add more.
    private static final int STATS_FIRST_YEAR = 2025;
    private static final int STATS_LAST_YEAR = 2026;

    private boolean isFormer(String status) {
        return status != null && status.trim().equalsIgnoreCase("Former");
    }

    @Transactional(readOnly = true)
    public List<ConferenceFacultyResponseDTO> getConferenceFacultyScore(ConferenceReportFilter filter) {
        List<String> q = filter.resolveQuartiles();
        boolean hasQ = q != null && !q.isEmpty();
        return publicationAuthorRepository
                .findConferenceFacultyScores(filter.resolveFrom(), filter.resolveTo(), hasQ, hasQ ? q : List.of("")).stream()
                .map(r -> new ConferenceFacultyResponseDTO(
                        r.getFacultyId(), r.getFacultyName(), r.getConferenceScore()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StudentTypeCountResponseDTO> getStudentTypeCounts(ConferenceReportFilter filter) {
        List<String> q = filter.resolveQuartiles();
        boolean hasQ = q != null && !q.isEmpty();
        Map<String, Long> counts = new HashMap<>();
        for (StudentTypeCountView r : publicationAuthorRepository
                .countConferencePapersByStudentType(filter.resolveFrom(), filter.resolveTo(), hasQ, hasQ ? q : List.of(""))) {
            counts.merge(r.getStudentType(), r.getTotal(), Long::sum);
        }
        return STUDENT_TYPES.stream()
                .map(t -> new StudentTypeCountResponseDTO(t, counts.getOrDefault(t, 0L)))
                .toList();
    }
    
    @Transactional(readOnly = true)
    public ConferenceChartsResponseDTO getConferenceCharts(ConferenceReportFilter filter) {
        LocalDate from = filter.resolveFrom();
        LocalDate to = filter.resolveTo();
        List<Object[]> rows = conferencePaperRepository.findChartRows(from, to, filter.resolveQuartiles());

        Map<YearMonth, Long> perMonth = new HashMap<>();
        Map<String, Long> typeCounts = new LinkedHashMap<>();
        TYPE_LABELS.forEach(l -> typeCounts.put(l, 0L));
        Map<String, Long> quartileCounts = new LinkedHashMap<>();
        QUARTILE_LABELS.forEach(l -> quartileCounts.put(l, 0L));

        for (Object[] r : rows) {
            // month (by conference start date)
            LocalDate date = toLocalDate(r[0]);
            if (date != null) perMonth.merge(YearMonth.from(date), 1L, Long::sum);

            // national / international (check INTERNATIONAL first, it contains "NATIONAL")
            String type = r[1] == null ? "" : ((String) r[1]).trim().toUpperCase(Locale.ROOT);
            if (type.contains("INTERNATIONAL")) typeCounts.merge("International", 1L, Long::sum);
            else if (type.contains("NATIONAL")) typeCounts.merge("National", 1L, Long::sum);

            // quartile (blank or unknown goes to N/A)
            String qRaw = r[2] == null ? "" : ((String) r[2]).trim();
            String qLabel = "N/A";
            for (String l : QUARTILE_LABELS) {
                if (l.equalsIgnoreCase(qRaw)) { qLabel = l; break; }
            }
            quartileCounts.merge(qLabel, 1L, Long::sum);
        }

        List<ConferenceChartsResponseDTO.MonthCount> monthly = new ArrayList<>();
        if (!perMonth.isEmpty()) {
            YearMonth start = from != null ? YearMonth.from(from) : Collections.min(perMonth.keySet());
            YearMonth end = to != null ? YearMonth.from(to) : Collections.max(perMonth.keySet());
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM''yy", Locale.ENGLISH);
            for (YearMonth ym = start; !ym.isAfter(end); ym = ym.plusMonths(1)) {
                monthly.add(new ConferenceChartsResponseDTO.MonthCount(
                        ym.format(fmt), perMonth.getOrDefault(ym, 0L)));
            }
        }

        return new ConferenceChartsResponseDTO(
                rows.size(),
                monthly,
                typeCounts.entrySet().stream()
                        .map(e -> new ConferenceChartsResponseDTO.Bucket(e.getKey(), e.getValue())).toList(),
                quartileCounts.entrySet().stream()
                        .map(e -> new ConferenceChartsResponseDTO.Bucket(e.getKey(), e.getValue())).toList());
    }

    // native queries may hand back java.sql.Date or LocalDate depending on the Hibernate version
    private static LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate d) return d;
        if (value instanceof java.sql.Date d) return d.toLocalDate();
        return null;
    }
    
    @Transactional(readOnly = true)
    public List<ConferenceChartsResponseDTO.StatisticsRow> getConferenceStatistics() {
        List<FacultyYearCountView> rows =
                publicationAuthorRepository.findConferencePapersPerFacultyByAcademicYear(
                        STATS_FIRST_YEAR, STATS_LAST_YEAR);

        Map<Long, String> names = new LinkedHashMap<>();
        Map<Long, Boolean> former = new HashMap<>();
        Map<Long, Map<Integer, Long>> counts = new HashMap<>();

        for (FacultyYearCountView r : rows) {
            Long id = r.getFacultyId();
            names.putIfAbsent(id, r.getFacultyName());
            former.putIfAbsent(id, isFormer(r.getFacultyStatus()));
            if (r.getAcademicYear() != null) {
                long n = r.getPaperCount() == null ? 0L : r.getPaperCount();
                counts.computeIfAbsent(id, k -> new HashMap<>())
                      .merge(r.getAcademicYear().intValue(), n, Long::sum);
            }
        }

        List<ConferenceChartsResponseDTO.StatisticsRow> result = new ArrayList<>();
        for (Map.Entry<Long, String> e : names.entrySet()) {
            Long id = e.getKey();
            Map<Integer, Long> perYear = counts.getOrDefault(id, Map.of());
            Map<String, Object> yearCounts = new LinkedHashMap<>();
            for (int y = STATS_FIRST_YEAR; y <= STATS_LAST_YEAR; y++) {
                long n = perYear.getOrDefault(y, 0L);
                String label = y + "-" + String.format("%02d", (y + 1) % 100);   // "2025-26"
                yearCounts.put(label, (n == 0 && former.get(id)) ? (Object) "N/A" : (Object) n);
            }
            result.add(new ConferenceChartsResponseDTO.StatisticsRow(id, e.getValue(), yearCounts));
        }
        return result;
    }
}