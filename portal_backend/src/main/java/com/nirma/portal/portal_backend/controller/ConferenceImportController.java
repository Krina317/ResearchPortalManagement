package com.nirma.portal.portal_backend.controller;

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

    @PostMapping("/import")
    public ConferenceImportResult importConference(@RequestParam("file") MultipartFile file) {
        try {
            return conferenceImportService.importConference(file);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage(), e); // temporary — replace with your try/catch style + proper error DTO later
        }
    }
}