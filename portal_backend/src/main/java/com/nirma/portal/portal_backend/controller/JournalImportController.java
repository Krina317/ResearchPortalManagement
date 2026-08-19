package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.service.JournalImportResult;
import com.nirma.portal.portal_backend.service.JournalImportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalImportController {

    private final JournalImportService journalImportService;

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<?> importJournal(@RequestParam("file") MultipartFile file) {
        try {
            JournalImportResult result = journalImportService.importJournal(file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}