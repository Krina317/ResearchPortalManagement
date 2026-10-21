package com.nirma.portal.portal_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.JournalFacultyResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;
import com.nirma.portal.portal_backend.dto.JournalReportFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class JournalReportsService {

    private final PublicationAuthorRepository publicationAuthorRepository;

    @Transactional(readOnly = true)
    public List<JournalFacultyResponseDTO> getJournalFacultyScore(JournalReportFilter filter) {
        return publicationAuthorRepository.findJournalFacultyScores(filter.fromTotal(), filter.toTotal()).stream()
                .map(r -> new JournalFacultyResponseDTO(
                        r.getFacultyId(), r.getFacultyName(), r.getJournalScore()))
                .toList();
    }

    
    private static final List<String> STUDENT_TYPES = List.of("UG", "PG", "PHD");

    @Transactional(readOnly = true)
    public List<StudentTypeCountResponseDTO> getStudentTypeCounts(JournalReportFilter filter) {
        Map<String, Long> counts = new HashMap<>();
        for (StudentTypeCountView r : publicationAuthorRepository
                .countJournalStudentsByType(filter.fromTotal(), filter.toTotal())) {
            counts.merge(r.getStudentType(), r.getTotal(), Long::sum);
        }
        return STUDENT_TYPES.stream()
                .map(t -> new StudentTypeCountResponseDTO(t, counts.getOrDefault(t, 0L)))
                .toList();
    }
}