package com.nirma.portal.portal_backend.dto;

import java.util.List;
import java.util.Map;

public record ConferenceChartsResponseDTO(
        long totalPapers,
        List<MonthCount> monthly,
        List<Bucket> types,
        List<Bucket> quartiles) {

    public record Bucket(String label, long count) {}
    public record MonthCount(String month, long count) {}
    public record StatisticsRow(Long facultyId, String facultyName, Map<String, Object> counts) {}
}