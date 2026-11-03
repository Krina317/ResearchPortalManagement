package com.nirma.portal.portal_backend.service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.BookChapterReportsDTO;
import com.nirma.portal.portal_backend.dto.JournalChartsResponseDTO;
import com.nirma.portal.portal_backend.dto.JournalReportFilter;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;
import com.nirma.portal.portal_backend.repository.FacultyYearCountView;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookChapterReportsService {

    private final BookChapterRepository bookChapterRepository;
    private final PublicationAuthorRepository publicationAuthorRepository;

    // academic years shown in statistics, by start year (2025 = 2025-26). Extend LAST to add more.
    private static final int STATS_FIRST_YEAR = 2025;
    private static final int STATS_LAST_YEAR = 2026;

    @Transactional(readOnly = true)
    public BookChapterReportsDTO getMonthly(JournalReportFilter filter) {
        Integer from = filter.fromTotal();
        Integer to = filter.toTotal();

        Map<Integer, Long> perMonth = new HashMap<>();
        long total = 0;
        for (Object[] r : bookChapterRepository.countByMonth(from, to)) {
            int t = ((Number) r[0]).intValue();
            long n = ((Number) r[1]).longValue();
            perMonth.merge(t, n, Long::sum);
            total += n;
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
        return new BookChapterReportsDTO(total, monthly);
    }

    @Transactional(readOnly = true)
    public List<JournalChartsResponseDTO.StatisticsRow> getStatistics() {
        List<FacultyYearCountView> rows =
                publicationAuthorRepository.findBookChapterPapersPerFacultyByAcademicYear(
                        STATS_FIRST_YEAR, STATS_LAST_YEAR);

        Map<Long, String> names = new LinkedHashMap<>();
        Map<Long, Boolean> former = new HashMap<>();
        Map<Long, Map<Integer, Long>> counts = new HashMap<>();

        for (FacultyYearCountView r : rows) {
            Long id = r.getFacultyId();
            names.putIfAbsent(id, r.getFacultyName());
            former.putIfAbsent(id, r.getFacultyStatus() != null
                    && r.getFacultyStatus().trim().equalsIgnoreCase("Former"));
            if (r.getAcademicYear() != null) {
                long n = r.getPaperCount() == null ? 0L : r.getPaperCount();
                counts.computeIfAbsent(id, k -> new HashMap<>())
                      .merge(r.getAcademicYear().intValue(), n, Long::sum);
            }
        }

        List<JournalChartsResponseDTO.StatisticsRow> result = new ArrayList<>();
        for (Map.Entry<Long, String> e : names.entrySet()) {
            Long id = e.getKey();
            Map<Integer, Long> perYear = counts.getOrDefault(id, Map.of());
            Map<String, Object> yearCounts = new LinkedHashMap<>();
            for (int y = STATS_FIRST_YEAR; y <= STATS_LAST_YEAR; y++) {
                long n = perYear.getOrDefault(y, 0L);
                String label = y + "-" + String.format("%02d", (y + 1) % 100);
                yearCounts.put(label, (n == 0 && former.get(id)) ? (Object) "NA" : (Object) n);
            }
            result.add(new JournalChartsResponseDTO.StatisticsRow(id, e.getValue(), yearCounts));
        }
        return result;
    }
}