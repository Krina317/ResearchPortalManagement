package com.nirma.portal.portal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nirma.portal.portal_backend.service.ConferenceQueryService;
import com.nirma.portal.portal_backend.service.JournalQueryService;
import com.nirma.portal.portal_backend.service.NuFundedProjectService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ConferenceQueryService conferenceQueryService;
    private final JournalQueryService journalQueryService;
    private final NuFundedProjectService nuFundedProjectService;

    @GetMapping("/count/conference")
    public long getTotalConferencePapers() {

        log.trace("Entered getTotalConferencePapers()");

        long count = conferenceQueryService.getTotalCount();

        log.debug("Total conference papers: {}", count);

        return count;
    }

    @GetMapping("/count/journal")
    public long getTotalJournalPaper() {

        log.trace("Entered getTotalJournalPaper()");

        long count = journalQueryService.getTotalCount();

        log.debug("Total journal papers: {}", count);

        return count;
    }

    @GetMapping("/count/nu-funded-projects")
    public long getTotalNuFundedProjects() {

        log.trace("Entered getTotalNuFundedProjects()");

        long count = nuFundedProjectService.getAllProjects().size();

        log.debug("Total NU funded projects: {}", count);

        return count;
    }
}