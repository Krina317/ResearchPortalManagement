package com.nirma.portal.portal_backend.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.ConferenceListItemDTO;
import com.nirma.portal.portal_backend.dto.ConferenceRequestDTO;
import com.nirma.portal.portal_backend.entity.ConferencePaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.ConferencePaperNotFoundException;
import com.nirma.portal.portal_backend.exception.DuplicateConferencePaperException;
import com.nirma.portal.portal_backend.repository.ConferencePaperRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConferenceCRUD {

    private final ConferencePaperRepository conferencePaperRepository;
    private final DepartmentListRepository departmentListRepository;
    private final PublicationAuthorService publicationAuthorService;
    private final ConferenceQueryService conferenceQueryService;

    @Transactional
    public ConferenceListItemDTO create(ConferenceRequestDTO req) {
        log.info("Creating conference paper '{}'", req.getPaperTitle());
        validate(req);

        String title = req.getPaperTitle().trim();
        if (conferencePaperRepository.existsByPaperTitle(title)) {
            throw new DuplicateConferencePaperException("Conference paper '" + title + "' already exists");
        }

        ConferencePaper paper = new ConferencePaper();
        apply(paper, req);
        paper = conferencePaperRepository.save(paper);

        publicationAuthorService.replaceAuthors(paper.getId(), PublicationType.CONFERENCE, req.getAuthors());
        return conferenceQueryService.getById(paper.getId());
    }

    @Transactional
    public ConferenceListItemDTO update(Long id, ConferenceRequestDTO req) {
        log.info("Updating conference paper {}", id);
        ConferencePaper paper = conferencePaperRepository.findById(id)
                .orElseThrow(() -> new ConferencePaperNotFoundException("Conference paper " + id + " not found"));

        validate(req);

        String title = req.getPaperTitle().trim();
        if (conferencePaperRepository.existsByPaperTitleAndIdNot(title, id)) {
            throw new DuplicateConferencePaperException("Conference paper '" + title + "' already exists");
        }

        apply(paper, req);
        conferencePaperRepository.save(paper);

        publicationAuthorService.replaceAuthors(id, PublicationType.CONFERENCE, req.getAuthors());
        return conferenceQueryService.getById(id);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting conference paper {}", id);
        ConferencePaper paper = conferencePaperRepository.findById(id)
                .orElseThrow(() -> new ConferencePaperNotFoundException("Conference paper " + id + " not found"));

        publicationAuthorService.removeAuthors(id, PublicationType.CONFERENCE);
        conferencePaperRepository.delete(paper);
    }

    private void validate(ConferenceRequestDTO req) {
        Set<String> allowedDeptCodes = departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.CONFERENCE)
                .stream()
                .map(d -> d.getDeptCode().trim().toUpperCase())
                .collect(Collectors.toSet());

        String deptCode = req.getDeptCode().trim().toUpperCase();
        if (!allowedDeptCodes.contains(deptCode)) {
            throw new IllegalArgumentException("Invalid department code '" + deptCode + "'");
        }

        if (req.getFromDate() != null && req.getToDate() != null
                && req.getToDate().isBefore(req.getFromDate())) {
            throw new IllegalArgumentException("To date cannot be before from date");
        }
    }

    private void apply(ConferencePaper paper, ConferenceRequestDTO req) {
        paper.setSourceId(req.getSourceId());
        paper.setConferenceName(req.getConferenceName().trim());
        paper.setConferenceType(req.getConferenceType().trim());
        paper.setPaperTitle(req.getPaperTitle().trim());
        paper.setFromDate(req.getFromDate());
        paper.setToDate(req.getToDate());
        paper.setInstituteName(req.getInstituteName().trim());
        paper.setDeptCode(req.getDeptCode().trim().toUpperCase());
    }
}