package com.nirma.portal.portal_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nirma.portal.portal_backend.service.ConferenceImportResult;
import com.nirma.portal.portal_backend.service.ConferenceImportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conference")
@RequiredArgsConstructor
public class ConferenceImportController {

    private final ConferenceImportService conferenceImportService;

    @PostMapping(value = "/import", consumes = "multipart/form-data")
    public ResponseEntity<?> importConference(@RequestParam("file") MultipartFile file) {
        try {
            ConferenceImportResult result = conferenceImportService.importConference(file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}