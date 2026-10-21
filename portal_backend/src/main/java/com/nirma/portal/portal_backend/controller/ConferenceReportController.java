package com.nirma.portal.portal_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ConferenceFacultyResponseDTO;
import com.nirma.portal.portal_backend.dto.ConferenceReportFilter;
import com.nirma.portal.portal_backend.dto.ReviewAuthorDTO;
import com.nirma.portal.portal_backend.dto.ReviewDecisionRequestDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.service.AuthorReviewService;
import com.nirma.portal.portal_backend.service.ConferenceReportsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conference/reports")
@RequiredArgsConstructor
public class ConferenceReportController {

    private final AuthorReviewService authorReviewService;
    private final ConferenceReportsService conferenceReportsService;

    @GetMapping("/review-authors")
    public List<ReviewAuthorDTO> getReviewAuthors() {
        return authorReviewService.getConferenceReviewAuthors();   // to add, needs AuthorReviewService
    }

    @PutMapping("/review-authors/{authorId}")
    public ResponseEntity<Void> decide(@PathVariable Long authorId,
                                       @Valid @RequestBody ReviewDecisionRequestDTO request) {
        authorReviewService.decide(authorId, request.getIsFaculty(), request.getFacultyId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/faculty-scores")
    public List<ConferenceFacultyResponseDTO> getFacultyScores(ConferenceReportFilter filter) {
        return conferenceReportsService.getConferenceFacultyScore(filter);
    }

    @GetMapping("/student-counts")
    public List<StudentTypeCountResponseDTO> getStudentCounts(ConferenceReportFilter filter) {
        return conferenceReportsService.getStudentTypeCounts(filter);
    }
}