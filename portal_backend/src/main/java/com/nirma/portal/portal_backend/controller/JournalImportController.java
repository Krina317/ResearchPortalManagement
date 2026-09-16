package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.service.JournalImportResult;
import com.nirma.portal.portal_backend.service.JournalImportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalImportController {

    private final JournalImportService journalImportService;

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<?> importJournal(@RequestParam("file") MultipartFile file) {

        log.trace("Entered importJournal()");

        try {
            log.info("Starting journal publication import for file '{}'",
                    file != null ? file.getOriginalFilename() : "null");

            JournalImportResult result =
                    journalImportService.importJournal(file);

            log.info("Journal publication import completed successfully for file '{}'",
                    file != null ? file.getOriginalFilename() : "null");

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            log.warn("Journal publication import rejected: {}", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}