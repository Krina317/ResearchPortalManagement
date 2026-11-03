package com.nirma.portal.portal_backend.dto;

import java.util.List;

public record BookChapterReportsDTO(
        long totalChapters,
        List<JournalChartsResponseDTO.MonthCount> monthly) {
}