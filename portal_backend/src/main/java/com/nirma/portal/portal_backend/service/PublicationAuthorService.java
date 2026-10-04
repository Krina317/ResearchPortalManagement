package com.nirma.portal.portal_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.entity.AuthorMaster;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.PublicationAuthorNotFoundException;
import com.nirma.portal.portal_backend.matching.AuthorNameSplitter;
import com.nirma.portal.portal_backend.repository.AuthorMasterRepository;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicationAuthorService {

    private final AuthorMasterRepository authorMasterRepository;
    private final PublicationAuthorRepository publicationAuthorRepository;
    private final FacultyMatchService facultyMatchService;

    /**
     * Replaces all authors of a paper with the given names (position = order in the list).
     * Existing authors are reused, new ones go through the faculty matcher,
     * and authors that no paper uses any more are deleted from AuthorMaster.
     */
    @Transactional
    public void replaceAuthors(Long publicationId, PublicationType type, List<String> rawNames) {
        List<String> names = new ArrayList<>();
        if (rawNames != null) {
            for (String raw : rawNames) {
                names.addAll(AuthorNameSplitter.split(raw));
            }
        }

        List<Long> oldAuthorIds = publicationAuthorRepository
                .findByPublicationIdAndPublicationType(publicationId, type)
                .stream()
                .map(pa -> pa.getAuthor().getAuthorId())
                .distinct()
                .toList();

        publicationAuthorRepository.deleteByPublicationIdAndPublicationType(publicationId, type);
        publicationAuthorRepository.flush();

        facultyMatchService.refresh();

        int position = 1;
        for (String name : names) {
            String normalizedName = normalizeName(name);

            Optional<AuthorMaster> existing = authorMasterRepository.findByNormalizedName(normalizedName);

            AuthorMaster author;
            if (existing.isPresent()) {
                author = existing.get();
            } else {
                author = new AuthorMaster();
                author.setDisplayName(name);
                author.setNormalizedName(normalizedName);
                facultyMatchService.applyTo(author, name);
                author = authorMasterRepository.save(author);
            }

            PublicationAuthor link = new PublicationAuthor();
            link.setAuthor(author);
            link.setPublicationId(publicationId);
            link.setPublicationType(type);
            link.setAuthorPosition(position++);
            publicationAuthorRepository.save(link);
        }

        for (Long oldId : oldAuthorIds) {
            if (publicationAuthorRepository.countByAuthor_AuthorId(oldId) == 0) {
                authorMasterRepository.deleteById(oldId);
                log.debug("Deleted orphan author {}", oldId);
            }
        }
    }

    /** Removes all authors of a paper (used when the paper is deleted). */
    @Transactional
    public void removeAuthors(Long publicationId, PublicationType type) {
        replaceAuthors(publicationId, type, List.of());
    }

    private String normalizeName(String name) {
        return name.toUpperCase().replaceAll("\\s+", " ").trim();
    }
    private static final java.util.Set<String> STUDENT_TYPES = java.util.Set.of("UG", "PG", "PHD");

    /** Sets (or clears) the student level on one author link of a journal paper. */
    @Transactional
    public void setStudentType(Long linkId, String studentType) {
        PublicationAuthor link = publicationAuthorRepository.findById(linkId)
                .orElseThrow(() -> new PublicationAuthorNotFoundException("Author link " + linkId + " not found"));

        if (link.getPublicationType() != PublicationType.JOURNAL) {
            throw new IllegalArgumentException("Student levels are only supported for journal papers");
        }

        if ("NU".equals(link.getAuthor().getAuthorType())) {
            throw new IllegalArgumentException("This author is Nirma faculty and cannot be marked as a student");
        }

        String value = (studentType == null || studentType.isBlank()) ? null : studentType.trim().toUpperCase();
        if (value != null && !STUDENT_TYPES.contains(value)) {
            throw new IllegalArgumentException("Student type must be UG, PG or PHD");
        }

        link.setStudentType(value);
        publicationAuthorRepository.save(link);
    }
}