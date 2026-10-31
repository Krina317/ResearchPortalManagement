package com.nirma.portal.portal_backend.dto;

import java.util.List;
import java.util.Map;

public record JournalChartsResponseDTO(
        long totalPapers,
        List<Bucket> impactFactor,
        List<MonthCount> monthly,
        List<IndexCount> indexing) {

    public record Bucket(String label, long count) {}
    public record MonthCount(String month, long count) {}
    public record IndexCount(String index, long count) {}
    public record StatisticsRow(Long facultyId, String facultyName, Map<String, Object> counts) {}
}