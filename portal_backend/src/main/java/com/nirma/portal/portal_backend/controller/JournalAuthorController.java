package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.*;

import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.StudentTypeRequestDTO;
import com.nirma.portal.portal_backend.entity.PublicationAuthor;
import com.nirma.portal.portal_backend.exception.PublicationAuthorNotFoundException;
import com.nirma.portal.portal_backend.repository.PublicationAuthorRepository;
import com.nirma.portal.portal_backend.service.JournalQueryService;
import com.nirma.portal.portal_backend.service.PublicationAuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal-authors")
@RequiredArgsConstructor
public class JournalAuthorController {

    private final PublicationAuthorService publicationAuthorService;
    private final PublicationAuthorRepository publicationAuthorRepository;
    private final JournalQueryService journalQueryService;

    @PutMapping("/{linkId}/student-type")
    public JournalListItemDTO setStudentType(@PathVariable Long linkId,
                                             @RequestBody StudentTypeRequestDTO request) {
        publicationAuthorService.setStudentType(linkId, request.getStudentType());

        PublicationAuthor link = publicationAuthorRepository.findById(linkId)
                .orElseThrow(() -> new PublicationAuthorNotFoundException("Author link " + linkId + " not found"));
        return journalQueryService.getById(link.getPublicationId());
    }
}