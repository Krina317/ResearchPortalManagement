package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.service.BookChapterImportResult;
import com.nirma.portal.portal_backend.service.BookChapterImportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/book-chapters")
@RequiredArgsConstructor
public class BookChapterImportController {

    private final BookChapterImportService bookChapterImportService;

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<?> importBookChapters(
            @RequestParam("file") MultipartFile file) {

        try {
            BookChapterImportResult result =
                    bookChapterImportService.importBookChapters(file);

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}