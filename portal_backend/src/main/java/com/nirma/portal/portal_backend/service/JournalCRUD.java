package com.nirma.portal.portal_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.JournalListItemDTO;
import com.nirma.portal.portal_backend.dto.JournalRequestDTO;
import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.JournalPaper;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.DuplicateJournalPaperException;
import com.nirma.portal.portal_backend.exception.JournalPaperNotFoundException;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;
import com.nirma.portal.portal_backend.repository.JournalPaperRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class JournalCRUD {

    private static final List<String> MONTHS = List.of(
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER");

    private final JournalPaperRepository journalPaperRepository;
    private final DepartmentListRepository departmentListRepository;
    private final PublicationAuthorService publicationAuthorService;
    private final JournalQueryService journalQueryService;

    @Transactional
    public JournalListItemDTO create(JournalRequestDTO req) {
        log.info("Creating journal paper '{}'", req.getPaperTitle());
        String deptName = validateAndResolveDept(req);

        String title = req.getPaperTitle().trim();
        if (journalPaperRepository.existsByPaperTitle(title)) {
            throw new DuplicateJournalPaperException("Journal paper '" + title + "' already exists");
        }

        JournalPaper paper = new JournalPaper();
        apply(paper, req, deptName);
        paper = journalPaperRepository.save(paper);

        publicationAuthorService.replaceAuthors(paper.getId(), PublicationType.JOURNAL, req.getAuthors());
        return journalQueryService.getById(paper.getId());
    }

    @Transactional
    public JournalListItemDTO update(Long id, JournalRequestDTO req) {
        log.info("Updating journal paper {}", id);
        JournalPaper paper = journalPaperRepository.findById(id)
                .orElseThrow(() -> new JournalPaperNotFoundException("Journal paper " + id + " not found"));

        String deptName = validateAndResolveDept(req);

        String title = req.getPaperTitle().trim();
        if (journalPaperRepository.existsByPaperTitleAndIdNot(title, id)) {
            throw new DuplicateJournalPaperException("Journal paper '" + title + "' already exists");
        }

        apply(paper, req, deptName);
        journalPaperRepository.save(paper);

        publicationAuthorService.replaceAuthors(id, PublicationType.JOURNAL, req.getAuthors());
        return journalQueryService.getById(id);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting journal paper {}", id);
        JournalPaper paper = journalPaperRepository.findById(id)
                .orElseThrow(() -> new JournalPaperNotFoundException("Journal paper " + id + " not found"));

        publicationAuthorService.removeAuthors(id, PublicationType.JOURNAL);
        journalPaperRepository.delete(paper);
    }

    /** Checks the department and month; returns the department name exactly as stored in DepartmentList. */
    private String validateAndResolveDept(JournalRequestDTO req) {
        Map<String, String> canonicalByUpper = new HashMap<>();
        for (DepartmentList d : departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.JOURNAL)) {
            canonicalByUpper.put(d.getDeptName().trim().toUpperCase(), d.getDeptName());
        }

        String canonical = canonicalByUpper.get(req.getDeptName().trim().toUpperCase());
        if (canonical == null) {
            throw new IllegalArgumentException("Invalid department '" + req.getDeptName().trim() + "'");
        }

        String month = req.getMonthOfPublication();
        if (month != null && !month.isBlank() && !MONTHS.contains(month.trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid month '" + month.trim() + "'");
        }

        return canonical;
    }

    private void apply(JournalPaper paper, JournalRequestDTO req, String deptName) {
        paper.setSourceId(req.getSourceId());
        paper.setPaperTitle(req.getPaperTitle().trim());
        paper.setJournalName(req.getJournalName().trim());
        paper.setJournalType(req.getJournalType().trim());
        paper.setInstituteName(req.getInstituteName().trim());
        paper.setDeptName(deptName);

        paper.setFileName(clean(req.getFileName()));
        paper.setImpactFactorClarivate(clean(req.getImpactFactorClarivate()));
        paper.setImpactFactorJournal(clean(req.getImpactFactorJournal()));
        paper.setYearOfPublication(req.getYearOfPublication());
        paper.setMonthOfPublication(clean(req.getMonthOfPublication()));
        paper.setIndexIn(clean(req.getIndexIn()));
        paper.setIssnNo(clean(req.getIssnNo()));
        paper.setVolumeNo(clean(req.getVolumeNo()));
        paper.setIssueNo(clean(req.getIssueNo()));
        paper.setPageNo(clean(req.getPageNo()));
        paper.setWebsiteJournalLink(clean(req.getWebsiteJournalLink()));
        paper.setArticleLink(clean(req.getArticleLink()));
        paper.setDoiNumber(clean(req.getDoiNumber()));
        paper.setDownloadFileLink(clean(req.getDownloadFileLink()));
    }

    /** Trims; blank becomes null so empty form fields do not store empty strings. */
    private String clean(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}