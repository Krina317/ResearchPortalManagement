package com.nirma.portal.portal_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.ReviewAuthorDTO;
import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.FacultyList;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.PublicationAuthorNotFoundException;
import com.nirma.portal.portal_backend.repository.AuthorMasterRepository;
import com.nirma.portal.portal_backend.repository.FacultyListRepository;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthorReviewService {

    private final PublicationAuthorRepository publicationAuthorRepository;
    private final AuthorMasterRepository authorMasterRepository;
    private final FacultyListRepository facultyListRepository;

    @Transactional(readOnly = true)
    public List<ReviewAuthorDTO> getJournalReviewAuthors() {
        return publicationAuthorRepository.findAuthorsNeedingReview(PublicationType.JOURNAL)
                .stream()
                .map(a -> new ReviewAuthorDTO(
                        a.getAuthorId(),
                        a.getDisplayName(),
                        a.getAuthorType(),
                        a.getMatchReason(),
                        a.getFaculty() == null ? null : a.getFaculty().getId(),
                        a.getFaculty() == null ? null : a.getFaculty().getName()))
                .toList();
    }

    @Transactional
    public void decide(Long authorId, boolean isFaculty, Long facultyId) {
        AuthorMaster author = authorMasterRepository.findById(authorId)
                .orElseThrow(() -> new PublicationAuthorNotFoundException("Author " + authorId + " not found"));

        if (isFaculty) {
            Long chosenId = facultyId != null
                    ? facultyId
                    : (author.getFaculty() != null ? author.getFaculty().getId() : null);
            if (chosenId == null) {
                throw new IllegalArgumentException("Choose which faculty member this author is");
            }
            FacultyList faculty = facultyListRepository.findById(chosenId)
                    .orElseThrow(() -> new IllegalArgumentException("Faculty " + chosenId + " not found"));

            author.setAuthorType("NU");
            author.setFaculty(faculty);
            author.setMatchReason("Confirmed manually");
        } else {
            author.setAuthorType(null);
            author.setFaculty(null);
            author.setMatchReason("Confirmed not faculty");
        }

        author.setNeedsReview(false);
        author.setManuallyVerified(true);
        authorMasterRepository.save(author);
        log.info("Review decision for author {}: faculty={}", authorId, isFaculty);
    }
}