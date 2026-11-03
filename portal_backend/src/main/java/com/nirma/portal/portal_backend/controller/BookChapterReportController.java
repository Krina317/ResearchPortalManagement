package com.nirma.portal.portal_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.dto.BookChapterReportsDTO;
import com.nirma.portal.portal_backend.dto.JournalChartsResponseDTO;
import com.nirma.portal.portal_backend.dto.JournalReportFilter;
import com.nirma.portal.portal_backend.service.BookChapterReportsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/book-chapters/reports")
@RequiredArgsConstructor
public class BookChapterReportController {

    private final BookChapterReportsService reportsService;

    @GetMapping("/monthly")
    public BookChapterReportsDTO monthly(JournalReportFilter filter) {
        return reportsService.getMonthly(filter);
    }

    @GetMapping("/statistics")
    public List<JournalChartsResponseDTO.StatisticsRow> statistics() {
        return reportsService.getStatistics();
    }
}