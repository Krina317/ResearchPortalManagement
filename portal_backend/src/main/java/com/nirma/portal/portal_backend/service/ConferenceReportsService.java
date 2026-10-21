package com.nirma.portal.portal_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.ConferenceFacultyResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountView;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;
import com.nirma.portal.portal_backend.dto.ConferenceReportFilter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConferenceReportsService {

    private static final List<String> STUDENT_TYPES = List.of("UG", "PG", "PHD");

    private final PublicationAuthorRepository publicationAuthorRepository;

    @Transactional(readOnly = true)
    public List<ConferenceFacultyResponseDTO> getConferenceFacultyScore(ConferenceReportFilter filter) {
        return publicationAuthorRepository
                .findConferenceFacultyScores(filter.resolveFrom(), filter.resolveTo()).stream()
                .map(r -> new ConferenceFacultyResponseDTO(
                        r.getFacultyId(), r.getFacultyName(), r.getConferenceScore()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StudentTypeCountResponseDTO> getStudentTypeCounts(ConferenceReportFilter filter) {
        Map<String, Long> counts = new HashMap<>();
        for (StudentTypeCountView r : publicationAuthorRepository
                .countConferencePapersByStudentType(filter.resolveFrom(), filter.resolveTo())) {
            counts.merge(r.getStudentType(), r.getTotal(), Long::sum);
        }
        return STUDENT_TYPES.stream()
                .map(t -> new StudentTypeCountResponseDTO(t, counts.getOrDefault(t, 0L)))
                .toList();
    }
}