package com.nirma.portal.portal_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.ReviewAuthorDTO;
import com.nirma.portal.portal_backend.dto.ReviewDecisionRequestDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeCountResponseDTO;
import com.nirma.portal.portal_backend.dto.JournalFacultyResponseDTO;
import com.nirma.portal.portal_backend.service.AuthorReviewService;
import com.nirma.portal.portal_backend.service.JournalReportsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal/reports")
@RequiredArgsConstructor
public class JournalReportController {

    private final AuthorReviewService authorReviewService;
    private final JournalReportsService journalReportService;

    @GetMapping("/review-authors")
    public List<ReviewAuthorDTO> getReviewAuthors() {
        return authorReviewService.getJournalReviewAuthors();
    }

    @PutMapping("/review-authors/{authorId}")
    public ResponseEntity<Void> decide(@PathVariable Long authorId,
                                       @Valid @RequestBody ReviewDecisionRequestDTO request) {
        authorReviewService.decide(authorId, request.getIsFaculty(), request.getFacultyId());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/faculty-scores")
    public List<JournalFacultyResponseDTO> getFacultyScore(){
    	return journalReportService.getJournalFacultyScore();
    }
    
    @GetMapping("/student-counts")
    public List<StudentTypeCountResponseDTO> getStudentCounts() {
        return journalReportService.getStudentTypeCounts();
    }
}