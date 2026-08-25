package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.service.ConferenceQueryService;
import com.nirma.portal.portal_backend.service.JournalQueryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final ConferenceQueryService conferenceQueryService;
    private final JournalQueryService journalQueryService;
    @GetMapping("/count/conference")
    public long getTotalConferencePapers(){
        return conferenceQueryService.getTotalCount();
    }
    @GetMapping("/count/journal")
    public long getTotalJournalPaper(){
    	return journalQueryService.getTotalCount();
    }
}