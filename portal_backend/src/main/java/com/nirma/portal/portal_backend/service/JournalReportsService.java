package com.nirma.portal.portal_backend.service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.JournalChartsResponseDTO;
import com.nirma.portal.portal_backend.dto.JournalFacultyResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;
import com.nirma.portal.portal_backend.dto.JournalReportFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class JournalReportsService {

    private final PublicationAuthorRepository publicationAuthorRepository;
    private final JournalPaperRepository journalPaperRepository;
    
    @Transactional(readOnly = true)
    public List<JournalFacultyResponseDTO> getJournalFacultyScore(JournalReportFilter filter) {
        List<String> q = filter.quartiles();
        boolean hasQ = q != null && !q.isEmpty();
        return publicationAuthorRepository.findJournalFacultyScores(
                        filter.fromTotal(), filter.toTotal(), hasQ, hasQ ? q : List.of(""))
                .stream()
                .map(r -> new JournalFacultyResponseDTO(
                        r.getFacultyId(), r.getFacultyName(), r.getJournalScore()))
                .toList();
    }

    private static final List<String> STUDENT_TYPES = List.of("UG", "PG", "PHD");

    @Transactional(readOnly = true)
    public List<StudentTypeCountResponseDTO> getStudentTypeCounts(JournalReportFilter filter) {
        List<String> q = filter.quartiles();
        boolean hasQ = q != null && !q.isEmpty();
        Map<String, Long> counts = new HashMap<>();
        for (StudentTypeCountView r : publicationAuthorRepository.countJournalStudentsByType(
                filter.fromTotal(), filter.toTotal(), hasQ, hasQ ? q : List.of(""))) {
            counts.merge(r.getStudentType(), r.getTotal(), Long::sum);
        }
        return STUDENT_TYPES.stream()
                .map(t -> new StudentTypeCountResponseDTO(t, counts.getOrDefault(t, 0L)))
                .toList();
    }
    
    private static final List<String> IF_LABELS =
            List.of("No IF", "IF<2", "2<=IF<5", "5<=IF<10", "IF>=10");

    @Transactional(readOnly = true)
    public JournalChartsResponseDTO getJournalCharts(JournalReportFilter filter) {
        Integer from = filter.fromTotal();
        Integer to = filter.toTotal();
        List<Object[]> rows = journalPaperRepository.findChartRows(from, to, filter.quartiles());

        Map<String, Long> buckets = new LinkedHashMap<>();
        IF_LABELS.forEach(l -> buckets.put(l, 0L));
        Map<Integer, Long> perMonth = new HashMap<>();
        Map<String, Long> indexCounts = new LinkedHashMap<>();
        Map<String, String> indexDisplay = new HashMap<>();

        for (Object[] r : rows) {
            // impact factor (Clarivate)
            buckets.merge(impactBucket((String) r[1]), 1L, Long::sum);

            // month
            if (r[0] != null) perMonth.merge(((Number) r[0]).intValue(), 1L, Long::sum);

            // indexing: a paper counts once in each index it belongs to
            String indexIn = (String) r[2];
            if (indexIn != null) {
                Set<String> seen = new HashSet<>();
                for (String part : indexIn.split("[,;/]")) {
                    String name = part.trim();
                    if (name.isEmpty()) continue;
                    String key = name.toUpperCase(Locale.ROOT);
                    indexDisplay.putIfAbsent(key, name);
                    if (seen.add(key)) indexCounts.merge(key, 1L, Long::sum);
                }
            }
        }

        List<JournalChartsResponseDTO.MonthCount> monthly = new ArrayList<>();
        if (!perMonth.isEmpty() || (from != null && to != null)) {
            int start = from != null ? from : Collections.min(perMonth.keySet());
            int end = to != null ? to : Collections.max(perMonth.keySet());
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM''yy", Locale.ENGLISH);
            for (int t = start; t <= end; t++) {
                int year = (t - 1) / 12;
                int month = t - year * 12;
                monthly.add(new JournalChartsResponseDTO.MonthCount(
                        YearMonth.of(year, month).format(fmt), perMonth.getOrDefault(t, 0L)));
            }
        }

        return new JournalChartsResponseDTO(
                rows.size(),
                buckets.entrySet().stream()
                        .map(e -> new JournalChartsResponseDTO.Bucket(e.getKey(), e.getValue())).toList(),
                monthly,
                indexCounts.entrySet().stream()
                        .map(e -> new JournalChartsResponseDTO.IndexCount(indexDisplay.get(e.getKey()), e.getValue()))
                        .toList());
    }

    private String impactBucket(String raw) {
        if (raw == null) return "No IF";
        try {
            double v = Double.parseDouble(raw.trim());
            if (v <= 0) return "No IF";
            if (v < 2) return "IF<2";
            if (v < 5) return "2<=IF<5";
            if (v < 10) return "5<=IF<10";
            return "IF>=10";
        } catch (NumberFormatException e) {
            return "No IF";   // "N/A", "-", blank, etc.
        }
    }
}