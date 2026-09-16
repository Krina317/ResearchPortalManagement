package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.service.ConferenceImportResult;
import com.nirma.portal.portal_backend.service.ConferenceImportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceImportController {

    private final ConferenceImportService conferenceImportService;

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<?> importConference(@RequestParam("file") MultipartFile file) {

        log.trace("Entered importConference()");

        try {
            log.info("Starting conference publication import for file '{}'",
                    file != null ? file.getOriginalFilename() : "null");

            ConferenceImportResult result =
                    conferenceImportService.importConference(file);

            log.info("Conference publication import completed successfully for file '{}'",
                    file != null ? file.getOriginalFilename() : "null");

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            log.warn("Conference publication import rejected: {}", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}