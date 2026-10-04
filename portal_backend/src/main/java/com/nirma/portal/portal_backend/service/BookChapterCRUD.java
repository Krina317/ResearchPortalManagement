package com.nirma.portal.portal_backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nirma.portal.portal_backend.dto.BookChapterListItemDTO;
import com.nirma.portal.portal_backend.dto.BookChapterRequestDTO;
import com.nirma.portal.portal_backend.entity.BookChapter;
import com.nirma.portal.portal_backend.entity.DepartmentList;
import com.nirma.portal.portal_backend.entity.PublicationType;
import com.nirma.portal.portal_backend.exception.BookChapterNotFoundException;
import com.nirma.portal.portal_backend.exception.DuplicateBookChapterException;
import com.nirma.portal.portal_backend.repository.BookChapterRepository;
import com.nirma.portal.portal_backend.repository.DepartmentListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookChapterCRUD {

    private final BookChapterRepository bookChapterRepository;
    private final DepartmentListRepository departmentListRepository;
    private final PublicationAuthorService publicationAuthorService;
    private final BookChapterQueryService bookChapterQueryService;

    @Transactional
    public BookChapterListItemDTO create(BookChapterRequestDTO req) {
        log.info("Creating book chapter '{}'", req.getBookChapterTitle());
        String deptName = validateAndResolveDept(req);

        String title = req.getBookChapterTitle().trim();
        if (bookChapterRepository.existsByBookChapterTitle(title)) {
            throw new DuplicateBookChapterException("Book chapter '" + title + "' already exists");
        }

        BookChapter bookChapter = new BookChapter();
        apply(bookChapter, req, deptName);
        bookChapter = bookChapterRepository.save(bookChapter);

        publicationAuthorService.replaceAuthors(bookChapter.getId(), PublicationType.BOOK_CHAPTER, req.getAuthors());
        return bookChapterQueryService.getById(bookChapter.getId());
    }

    @Transactional
    public BookChapterListItemDTO update(Long id, BookChapterRequestDTO req) {
        log.info("Updating book chapter {}", id);
        BookChapter bookChapter = bookChapterRepository.findById(id)
                .orElseThrow(() -> new BookChapterNotFoundException("Book chapter " + id + " not found"));

        String deptName = validateAndResolveDept(req);

        String title = req.getBookChapterTitle().trim();
        if (bookChapterRepository.existsByBookChapterTitleAndIdNot(title, id)) {
            throw new DuplicateBookChapterException("Book chapter '" + title + "' already exists");
        }

        apply(bookChapter, req, deptName);
        bookChapterRepository.save(bookChapter);

        publicationAuthorService.replaceAuthors(id, PublicationType.BOOK_CHAPTER, req.getAuthors());
        return bookChapterQueryService.getById(id);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting book chapter {}", id);
        BookChapter bookChapter = bookChapterRepository.findById(id)
                .orElseThrow(() -> new BookChapterNotFoundException("Book chapter " + id + " not found"));

        publicationAuthorService.removeAuthors(id, PublicationType.BOOK_CHAPTER);
        bookChapterRepository.delete(bookChapter);
    }

    /** Checks the department and month; returns the department name exactly as stored in DepartmentList. */
    private String validateAndResolveDept(BookChapterRequestDTO req) {
        Map<String, String> canonicalByUpper = new HashMap<>();
        for (DepartmentList d : departmentListRepository
                .findByPublicationTypeAndActiveTrue(PublicationType.BOOK_CHAPTER)) {
            if (d.getDeptName() != null && !d.getDeptName().isBlank()) {
                canonicalByUpper.put(d.getDeptName().trim().toUpperCase(), d.getDeptName());
            }
        }

        String canonical = canonicalByUpper.get(req.getDeptName().trim().toUpperCase());
        if (canonical == null) {
            throw new IllegalArgumentException("Invalid department '" + req.getDeptName().trim() + "'");
        }

        if (req.getMonth() != null && (req.getMonth() < 1 || req.getMonth() > 12)) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }

        return canonical;
    }

    private void apply(BookChapter bookChapter, BookChapterRequestDTO req, String deptName) {
        bookChapter.setSourceId(req.getSourceId());
        bookChapter.setBookTitle(req.getBookTitle().trim());
        bookChapter.setBookChapterTitle(req.getBookChapterTitle().trim());
        bookChapter.setInstituteName(req.getInstituteName().trim());
        bookChapter.setDeptName(deptName);

        bookChapter.setNameOfBookPublisher(clean(req.getNameOfBookPublisher()));
        bookChapter.setMonth(req.getMonth());
        bookChapter.setYear(req.getYear());
        bookChapter.setYearOfPublication(clean(req.getYearOfPublication()));
        bookChapter.setIsbnNo(clean(req.getIsbnNo()));
        bookChapter.setFileName(clean(req.getFileName()));
        bookChapter.setPublicationType(clean(req.getPublicationType()));
        bookChapter.setPublicationCity(clean(req.getPublicationCity()));
    }

    /** Trims; blank becomes null so empty form fields do not store empty strings. */
    private String clean(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}